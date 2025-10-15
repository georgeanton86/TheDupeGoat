import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Product } from "@shared/schema";
import { ShoppingCart, Tag, Truck } from "lucide-react";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 100 ? 0 : 8.99;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    // Store cart data in sessionStorage for checkout page
    sessionStorage.setItem('checkoutCart', JSON.stringify({
      items: cart,
      promoCode: promoApplied ? promoCode : null,
      subtotal,
      discount,
      shipping,
      total
    }));
    setLocation('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  const activeProducts = products?.filter(p => p.isActive) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-champagne mb-4">Biblical Collection</h1>
            <p className="text-lg text-champagne/80 max-w-2xl mx-auto mb-6">
              15 transformative fragrances inspired by Scripture. Each 30ml bottle carries divine purpose.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-champagne/90">
                <Truck className="w-5 h-5" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2 text-champagne/90">
                <Tag className="w-5 h-5" />
                <span>WELCOME10 for 10% off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Your Cart</h3>
                    <Badge variant="secondary" className="ml-auto">{cart.length}</Badge>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-500">{item.product.verseReference}</p>
                            </div>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(val) => updateQuantity(item.product.id, parseInt(val))}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                  <SelectItem key={n} value={n.toString()}>
                                    {n === 0 ? "Remove" : n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="font-semibold text-sm w-16 text-right">
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code */}
                      <div className="mb-4 pb-4 border-b">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={promoApplied}
                            className="h-9"
                          />
                          <Button
                            size="sm"
                            onClick={applyPromoCode}
                            disabled={promoApplied}
                            className="bg-champagne text-luxury-black hover:bg-yellow-500"
                          >
                            Apply
                          </Button>
                        </div>
                        {promoApplied && (
                          <p className="text-xs text-green-600 mt-1">✓ 10% discount applied!</p>
                        )}
                      </div>

                      {/* Totals */}
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {promoApplied && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount (10%):</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        {subtotal < 100 && subtotal > 0 && (
                          <p className="text-xs text-gray-500">
                            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                          </p>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-luxury-black text-white hover:bg-charcoal"
                        size="lg"
                        onClick={handleCheckout}
                        data-testid="button-checkout"
                      >
                        Checkout with PayPal
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const stockPercent = (product.remainingInventory / product.totalInventory) * 100;
  const isLowStock = stockPercent < 20;
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative h-64 bg-gradient-to-br from-champagne/10 to-luxury-black/10 flex items-center justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-auto object-contain"
            data-testid={`img-product-${product.id}`}
          />
          {/* Product name label on bottle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="bg-luxury-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-champagne/30">
              <p className="text-champagne font-bold text-xs tracking-wider">{product.name}</p>
              <p className="text-champagne/60 text-[8px] font-medium mt-0.5">RVLTN PARFUMS</p>
            </div>
          </div>
          {/* Shield logo overlay - positioned on the bottle */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <img 
              src="/shield-logo.png" 
              alt="RVLTN Shield" 
              className="w-14 h-14 object-contain opacity-80"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          {/* Stock badge */}
          <Badge 
            variant={isLowStock ? "destructive" : "secondary"} 
            className={`absolute top-3 right-3 text-xs border-0 ${isLowStock ? 'bg-red-600 text-white' : 'bg-champagne text-luxury-black'}`}
          >
            {product.remainingInventory} left
          </Badge>
        </div>
        
        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-luxury-black">{product.name}</h3>
            <p className="text-xs text-champagne font-medium">{product.verseReference}</p>
          </div>

          <p className="text-sm text-gray-600 mb-2 italic">"{product.bibleVerse}"</p>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>

        {/* Sales Counter */}
        <div className="mb-4 p-3 bg-champagne/10 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{product.soldCount} bottles blessed</span>
            <span className="text-gray-600">{product.remainingInventory} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-champagne h-2 rounded-full transition-all"
              style={{ width: `${(product.soldCount / product.totalInventory) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-luxury-black">${product.price}</p>
            <p className="text-xs text-gray-500">{product.volume}</p>
          </div>
          <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
            <SelectTrigger className="w-20" data-testid={`select-quantity-${product.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={n.toString()} data-testid={`option-${n}`}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-champagne text-luxury-black hover:bg-yellow-500"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
