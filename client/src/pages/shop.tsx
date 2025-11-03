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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product, ProductVariant } from "@shared/schema";
import { ShoppingCart, Tag, Truck, Info } from "lucide-react";
import ProductDetailModal from "@/components/product-detail-modal";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

interface CartItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: variants, isLoading: variantsLoading } = useQuery<ProductVariant[]>({
    queryKey: ["/api/product-variants"],
  });

  const isLoading = productsLoading || variantsLoading;

  const addToCart = (variant: ProductVariant, product: Product, quantity: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.variant.id === variant.id);
      if (existing) {
        return prevCart.map(item =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { variant, product, quantity }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart(prevCart => prevCart.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 100 ? 0 : 8.99;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    // Store cart data in localStorage for Stripe checkout page
    localStorage.setItem('checkoutCart', JSON.stringify({
      cart: cart.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity
      })),
      promoCode: promoApplied ? promoCode : null
    }));
    setLocation('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
        <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse text-champagne">Loading...</div>
        </div>
      </div>
    );
  }

  const activeProducts = products?.filter(p => p.isActive) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
      <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-champagne mb-4">The Seven Seals Collection</h1>
            <p className="text-lg text-white max-w-2xl mx-auto mb-6">
              8 apocalyptic fragrances inspired by Revelation. Available in EDP & Extrait concentrations, multiple sizes.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white">
                <Truck className="w-5 h-5" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2 text-white">
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
              {activeProducts.map((product) => {
                const productVariants = variants?.filter(v => v.productId === product.id) || [];
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variants={productVariants}
                    onAddToCart={addToCart}
                    onViewDetails={(product) => {
                      setSelectedProduct(product);
                      setIsDetailModalOpen(true);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar - Desktop */}
          <div className="lg:col-span-1 hidden lg:block">
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
                          <div key={item.variant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-500">{item.variant.size} • {item.variant.concentration}</p>
                            </div>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
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
                              ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
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
                        Proceed to Checkout
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Header Cart Drawer - Opened from header cart button */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
              <Badge variant="secondary" className="ml-auto">{cart.length}</Badge>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.variant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.variant.size} • {item.variant.concentration}</p>
                      </div>
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
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
                        ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-4 pb-4 border-b">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="flex-1"
                    />
                    <Button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-green-600 mt-1">✓ 10% discount applied!</p>
                  )}
                </div>

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
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Cart Button - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 bg-champagne text-luxury-black hover:bg-yellow-500 shadow-2xl relative"
              data-testid="button-mobile-cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white border-2 border-white">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart
                <Badge variant="secondary" className="ml-auto">{cart.length}</Badge>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.variant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">{item.variant.size} • {item.variant.concentration}</p>
                        </div>
                        <Select
                          value={item.quantity.toString()}
                          onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
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
                          ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
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
                        className="flex-1"
                        data-testid="input-promo-code-mobile"
                      />
                      <Button
                        onClick={applyPromoCode}
                        disabled={promoApplied || !promoCode}
                        variant="outline"
                        data-testid="button-apply-promo-mobile"
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
                    data-testid="button-checkout-mobile"
                  >
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Product Image Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-luxury-black/50 border border-champagne/30 rounded-lg p-6 text-center backdrop-blur-sm">
          <p className="text-sm text-champagne font-medium mb-2">
            ⚠️ Product Image Disclaimer
          </p>
          <p className="text-xs text-white/80 leading-relaxed max-w-3xl mx-auto">
            *Product images shown are AI-generated concept renderings for illustration purposes only. Actual bottle designs, colors, shapes, and packaging will vary from images shown. Each fragrance is handcrafted and bottled individually. Final product appearance is subject to change.
          </p>
        </div>
      </div>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

function ProductCard({ product, variants, onAddToCart, onViewDetails }: { 
  product: Product;
  variants: ProductVariant[];
  onAddToCart: (variant: ProductVariant, product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || "");

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(selectedVariant, product, quantity);
      setQuantity(1);
    }
  };

  const stockPercent = selectedVariant ? (selectedVariant.remainingInventory / selectedVariant.totalInventory) * 100 : 0;
  const isLowStock = stockPercent < 20;
  
  // Select the correct bottle image based on product name
  const getBottleImage = () => {
    switch (product.name) {
      case "EQUUS ALBUS": return equusAlbusImage;
      case "PAX OBSCURA": return paxObscuraImage;
      case "FAMES": return famesImage;
      case "MORTEM": return mortemImage;
      case "VOX CAELI": return voxCaeliImage;
      case "TERRA TREMOR": return terraTremorImage;
      case "SABBATUM": return sabbatumImage;
      case "LUX AETERNA": return luxAeternaImage;
      default: return equusAlbusImage;
    }
  };

  // Group variants into a nice display format
  const getVariantDisplay = (v: ProductVariant) => {
    return `${v.size} ${v.concentration} - $${v.price}`;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-charcoal to-luxury-black border-champagne/30">
      <CardContent className="p-0">
        <div className="relative h-80 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black flex items-center justify-center">
          <img 
            src={getBottleImage()} 
            alt={`${product.name} bottle`}
            className="h-72 w-auto object-contain"
            data-testid={`img-product-${product.id}`}
          />
          
          {selectedVariant && (
            <Badge 
              variant={isLowStock ? "destructive" : "secondary"} 
              className={`absolute top-3 right-3 text-xs border-0 ${isLowStock ? 'bg-red-600 text-white' : 'bg-champagne text-luxury-black'}`}
            >
              {selectedVariant.remainingInventory} left
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-champagne">{product.name}</h3>
            <p className="text-xs text-white/70 font-medium">{product.verseReference.replace('Revelation', 'REV').replace('–', '-')}</p>
          </div>

          <p className="text-sm text-white/80 mb-2 italic">"{product.bibleVerse}"</p>
          <p className="text-sm text-white/80 mb-4">{product.description}</p>

          {/* Variant Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-white mb-2 block">Select Size & Concentration:</label>
            <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
              <SelectTrigger className="w-full" data-testid={`select-variant-${product.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map(variant => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {getVariantDisplay(variant)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sales Counter for selected variant */}
          {selectedVariant && (
            <div className="mb-4 p-3 bg-champagne/10 rounded-lg border border-champagne/20">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white">{selectedVariant.soldCount} claimed</span>
                <span className="text-white/70">{selectedVariant.remainingInventory} remaining</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-champagne h-2 rounded-full transition-all"
                  style={{ width: `${(selectedVariant.soldCount / selectedVariant.totalInventory) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-champagne">
                ${selectedVariant?.price || "—"}
              </p>
              {selectedVariant && (
                <p className="text-xs text-white/60">{selectedVariant.size} • {selectedVariant.concentration}</p>
              )}
            </div>
            <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
              <SelectTrigger className="w-20" data-testid={`select-quantity-${product.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.remainingInventory === 0}
              className="flex-1 bg-champagne text-luxury-black hover:bg-yellow-500"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {selectedVariant && selectedVariant.remainingInventory > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewDetails(product)}
              data-testid={`button-view-details-${product.id}`}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
