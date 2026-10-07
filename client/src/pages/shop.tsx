import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
import { chicagoBottleImages, chicagoOffers, chicagoSetDiscountCents, countChicagoSets, isChicagoVariant } from "@shared/chicago";
import { dreamerOffers } from "@shared/dreamer";
import { tdgOffers, affiliationDisclosure } from "@shared/tdg";
import { cartPricing, parsePromoCodes, minimumCardChargeCents } from "@shared/promotions";
import { ShoppingCart, Tag, Truck, Info } from "lucide-react";
import ProductDetailModal from "@/components/product-detail-modal";
import { DreamerCollection, TdgCollection } from "@/components/catalog-collections";
import HybridInspirations from "@/components/hybrid-inspirations";
import { useToast } from "@/hooks/use-toast";
import { canAddCartLines, cartMatchesInventory, inventoryLimit, reconcileCart } from "@shared/cart-inventory";

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
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const checkingStock = useRef(false);
  const { toast } = useToast();
  const cartLines = (items: CartItem[]) => items.map(item => ({ ...item, variantId: item.variant.id }));

  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: variants, isLoading: variantsLoading, isError: variantsError, refetch: refetchVariants } = useQuery<ProductVariant[]>({
    queryKey: ["/api/product-variants"],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (!variants || cartMatchesInventory(cartLines(cart), variants)) return;
    setCart(reconcileCart(cartLines(cart), variants));
    toast({ title: "Stock changed", description: "Your cart was reduced to the available stock. Please review it before checkout." });
  }, [variants, cart, toast]);

  const isLoading = productsLoading || variantsLoading;
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
    }
  }, [isLoading]);

  const addToCart = (variant: ProductVariant, product: Product, quantity: number) => {
    if (checkingStock.current) return;
    if (!canAddCartLines(cartLines(cart), [{ variantId: variant.id, quantity }], variants || [])) {
      toast({ title: "Stock limit reached", description: "That quantity is not available, including the decants already in your cart." });
      return;
    }
    setCart(prevCart => {
      if (!canAddCartLines(cartLines(prevCart), [{ variantId: variant.id, quantity }], variants || [])) return prevCart;
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
    if (checkingStock.current) return;
    setCart(prevCart => prevCart.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (checkingStock.current || !Number.isInteger(quantity) || quantity < 0) return;
    if (quantity === 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.variant.id === variantId ? { ...item, quantity: Math.min(quantity, inventoryLimit(variants?.find(v => v.id === variantId))) } : item
      )
      .filter(item => item.quantity > 0)
    );
  };

  const applyPromoCode = () => {
    try {
      const codes = parsePromoCodes(promoCode);
      if (!codes.length) return;
      setPromoCode(codes.join(" "));
      setPromoApplied(true);
    } catch (error) {
      setPromoApplied(false);
      toast({ title: "Promo not applied", description: error instanceof Error ? error.message : "Invalid promo code", variant: "destructive" });
    }
  };

  const changePromoCode = (value: string) => {
    setPromoCode(value);
    setPromoApplied(false);
  };

  const subtotalCents = cart.reduce((sum, item) => sum + Math.round(Number(item.variant.price) * 100) * item.quantity, 0);
  const subtotal = subtotalCents / 100;
  const setCount = countChicagoSets(cart.map(item => ({ variantId: item.variant.id, quantity: item.quantity })));
  const setDiscount = (setCount * chicagoSetDiscountCents) / 100;
  const pricing = cartPricing(subtotalCents, setCount * chicagoSetDiscountCents, promoApplied ? promoCode : undefined);
  const discount = pricing.discountCents / 100;
  const shipping = pricing.shippingCents / 100;
  const total = pricing.totalCents / 100;
  const promoMessage = [
    pricing.discountPercent ? `${pricing.discountPercent}% discount applied.` : "",
    pricing.codes.includes("FREESHIP") ? "Free shipping applied." : "",
  ].filter(Boolean).join(" ");

  const handleCheckout = async () => {
    if (checkingStock.current || !cart.length) return;
    if (pricing.totalCents < minimumCardChargeCents) {
      toast({ title: "Total is below $0.50", description: "Stripe requires a $0.50 minimum charge. Add an item or remove a promo code.", variant: "destructive" });
      return;
    }
    checkingStock.current = true;
    setIsCheckingStock(true);
    try {
      const refreshed = await refetchVariants();
      if (refreshed.isError || !refreshed.data) throw new Error("Could not check stock. Please try again.");
      if (!cartMatchesInventory(cartLines(cart), refreshed.data)) {
        setCart(reconcileCart(cartLines(cart), refreshed.data));
        toast({ title: "Stock changed", description: "Your cart was reduced to the available stock. Please review it before checkout." });
        setIsCartOpen(true);
        return;
      }
    // A new purchase gets a new attempt and no previous buyer details.
    sessionStorage.removeItem("stripeCheckoutDraft");
    sessionStorage.removeItem("checkoutConfirmation");
    localStorage.setItem('checkoutCart', JSON.stringify({
      checkoutKey: crypto.randomUUID(),
      cart: cart.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity
      })),
      promoCode: promoApplied ? promoCode : null
    }));
    setLocation('/checkout');
    } catch (error) {
      toast({ title: "Checkout paused", description: error instanceof Error ? error.message : "Could not check stock.", variant: "destructive" });
    } finally {
      checkingStock.current = false;
      setIsCheckingStock(false);
    }
  };

  const quantityOptions = (variantId: string) =>
    Array.from({ length: inventoryLimit(variants?.find(v => v.id === variantId)) + 1 }, (_, n) => n);

  if (isLoading) {
    return (
      <div className="store-night min-h-[100dvh]">
        <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8">
          <div className="h-10 w-72 animate-pulse bg-[#d8b76a]/15" />
          <div className="mt-4 h-4 max-w-xl animate-pulse bg-white/10" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">{[0,1,2].map((n) => <div key={n} className="h-96 animate-pulse bg-white/5" />)}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const activeProducts = products?.filter(p => p.isActive) || [];
  const chicagoProducts = activeProducts.filter((p) => Boolean(chicagoBottleImages[p.name.toUpperCase()]));
  const dreamerProducts = activeProducts.filter(p => dreamerOffers.some(offer => offer.productId === p.id));
  const tdgProducts = activeProducts.filter(p => tdgOffers.some(offer => offer.productId === p.id));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasReferenceDecants = cart.some(item => isChicagoVariant(item.variant.id));
  const hasTdgDecants = cart.some(item =>
    dreamerOffers.some(offer => offer.productId === item.product.id) ||
    tdgOffers.some(offer => offer.productId === item.product.id),
  );
  const setItems = chicagoOffers.map(offer => {
    const product = chicagoProducts.find(p => p.id === offer.productId);
    const variant = variants?.find(v => v.id === offer.variantId);
    return product && variant && variant.remainingInventory > 0 ? { product, variant } : null;
  });
  const setInStock = setItems.every(Boolean);
  const setAvailable = setInStock && canAddCartLines(cartLines(cart),
    chicagoOffers.map(offer => ({ variantId: offer.variantId, quantity: 1 })), variants || []);
  const addSetToCart = () => {
    if (checkingStock.current || !setAvailable) return;
    setCart(previous => {
      if (!canAddCartLines(cartLines(previous),
        chicagoOffers.map(offer => ({ variantId: offer.variantId, quantity: 1 })), variants || [])) return previous;
      const next = [...previous];
      for (const item of setItems) {
        if (!item) return previous;
        const existing = next.find(line => line.variant.id === item.variant.id);
        if (existing) {
          next[next.indexOf(existing)] = { ...existing, quantity: existing.quantity + 1 };
        } else {
          next.push({ ...item, quantity: 1 });
        }
      }
      return next;
    });
    setIsCartOpen(true);
  };

  if (productsError || variantsError) {
    return <div className="min-h-screen bg-[#171a16] text-[#f3ead8]"><Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} /><main className="mx-auto max-w-3xl px-5 py-40 text-center"><p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b76a]">A brief pause</p><h1 className="mt-3 font-serif text-4xl">The shop could not load.</h1><p className="mt-4 text-sm text-white/65">Please try again. Your cart and checkout are unchanged.</p><Button onClick={() => { refetchProducts(); refetchVariants(); }} className="mt-7 bg-[#d8b76a] text-[#171a16] hover:bg-[#e7cc8e]">Retry loading</Button></main><Footer /></div>;
  }

  return (
    <div className="store-night min-h-[100dvh] text-[#f3ead8]">
      <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />
      
      {/* Hero Banner */}
      <div className="store-hero noir-grain relative isolate overflow-hidden border-b border-[#d4ad70]/25 pb-14 pt-32">
        <div className="absolute inset-0 -z-10 bg-[url('/dreamer/dreamer-series-tdg.jpg')] bg-cover bg-[center_42%] opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#18212a] via-[#18212a]/80 to-[#18212a]/30" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4ad70]">THE DUPE GOAT · Chicago fragrance house</p>
            <h1 className="mt-3 font-serif text-5xl leading-[.98] sm:text-7xl">Scent, shifted.<br /><span className="text-[#80eee8]">City afterimage.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Six hybrids lead the house: three Dreamer states and three Gaming compositions, built from dupe inspirations. Explore the twenty-five single-scent dupes after the hybrids. Reference images are not the packaging you receive.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Truck className="w-5 h-5" />
                <span>Free shipping on merchandise over $50</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Tag className="w-5 h-5" />
                <span>WELCOME10 for 10% off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
        <DreamerCollection products={dreamerProducts} variants={variants || []} onAdd={addToCart} onDetails={item => { setSelectedProduct(item); setIsDetailModalOpen(true); }} />
        {chicagoProducts.length > 0 && <section id="gaming" className="mb-16 scroll-mt-24">
          <div className="mb-7 flex flex-col justify-between gap-3 border-b border-[#dc7895]/35 pb-5 sm:flex-row sm:items-end">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#dc7895]">THE DUPE GOAT · Gaming hybrids</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">The Gaming Collection</h2></div>
             <p className="max-w-sm text-sm leading-6 text-white/70">Limited run of 25 per fragrance · 30 mL decants · $59.99 each. Smaller sizes are not available. Bottle photos are for reference; shipped decants look different.</p>
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-[#dc7895]/35 bg-[#dc7895]/10 p-4">
            <p className="text-sm text-[#f3ead8]"><strong>The full gaming set · $150 · free shipping</strong><span className="block text-white/65">One 30 mL decant of each fragrance. $29.97 less than buying separately; applied automatically in the cart.</span></p>
            <Button onClick={addSetToCart} disabled={!setAvailable || isCheckingStock} className="rounded-none bg-[#dc7895] text-[#151a20] hover:bg-[#ef9ab1]" data-testid="button-add-chicago-set">{setAvailable ? "Add the set — $150" : setInStock ? "Set stock limit reached" : "Set sold out"}</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {chicagoProducts.map((product) => <ProductCard key={product.id} product={product} variants={variants?.filter(v => v.productId === product.id) || []} cart={cart} isCheckingStock={isCheckingStock} onAddToCart={addToCart} onViewDetails={(item) => { setSelectedProduct(item); setIsDetailModalOpen(true); }} />)}
          </div>
        </section>}
        <TdgCollection products={tdgProducts} variants={variants || []} onAdd={addToCart} onDetails={item => { setSelectedProduct(item); setIsDetailModalOpen(true); }} />
        <section className="mb-16">
        <div className="grid lg:grid-cols-3 gap-8">

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
                    <p className="text-muted-foreground text-sm">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map(item => (
                          <div key={item.variant.id} className="flex items-center gap-3 p-3 bg-background text-foreground rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">{item.variant.size} • {item.variant.concentration}</p>
                            </div>
                            <Select
                              value={item.quantity.toString()}
                              disabled={isCheckingStock}
                              onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {quantityOptions(item.variant.id).map(n => (
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
                      {hasReferenceDecants && <p className="mb-3 text-xs text-muted-foreground">{hasTdgDecants ? "Designer bottle imagery identifies scent inspiration only. You receive a THE DUPE GOAT dupe or hybrid decant in each selected size—not the original pictured perfume." : "Gaming concept imagery is for reference only. Gaming fragrances ship in separate 30 mL decant bottles."}{hasTdgDecants && <><br />{affiliationDisclosure}</>}</p>}

                      {/* Promo Code */}
                      <div className="mb-4 pb-4 border-b">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Codes separated by spaces"
                            value={promoCode}
                            onChange={(e) => changePromoCode(e.target.value)}
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
                          <p className="text-xs text-primary mt-1">{promoMessage}</p>
                        )}
                      </div>

                      {/* Totals */}
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {setCount > 0 && <div className="flex justify-between text-primary"><span>Gaming set savings × {setCount}:</span><span>-${setDiscount.toFixed(2)}</span></div>}
                        {promoApplied && (
                          <div className="flex justify-between text-primary">
                            <span>Discount ({pricing.discountPercent}%):</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        {shipping > 0 && subtotalCents <= 5000 && subtotal > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Add ${((5001 - subtotalCents) / 100).toFixed(2)} more for free shipping.
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
                        disabled={isCheckingStock}
                        data-testid="button-checkout"
                      >
                        {isCheckingStock ? "Checking stock..." : "Proceed to Checkout"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Header Cart Drawer - Opened from header cart button */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full max-w-full sm:max-w-md overflow-y-auto p-4 sm:p-6">
          <SheetHeader className="pr-8">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
              <Badge variant="secondary" className="ml-auto">{cart.length}</Badge>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.variant.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 bg-card text-card-foreground rounded-lg sm:flex">
                      <div className="col-span-2 min-w-0 break-words sm:flex-1">
                        <p className="font-semibold text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.variant.size} • {item.variant.concentration}</p>
                      </div>
                      <Select
                        value={item.quantity.toString()}
                        disabled={isCheckingStock}
                        onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
                      >
                        <SelectTrigger className="w-20 h-8 shrink-0 sm:w-16" aria-label={`Quantity for ${item.product.name}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {quantityOptions(item.variant.id).map(n => (
                            <SelectItem key={n} value={n.toString()}>
                              {n === 0 ? "Remove" : n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="font-semibold text-sm whitespace-nowrap text-right sm:w-16 sm:shrink-0">
                        ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                  {hasReferenceDecants && <p className="mb-3 text-xs text-muted-foreground">{hasTdgDecants ? "Designer bottle imagery identifies scent inspiration only. You receive a THE DUPE GOAT dupe or hybrid decant in each selected size—not the original pictured perfume." : "Gaming concept imagery is for reference only. Gaming fragrances ship in separate 30 mL decant bottles."}{hasTdgDecants && <><br />{affiliationDisclosure}</>}</p>}

                <div className="mb-4 pb-4 border-b">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Codes separated by spaces"
                      value={promoCode}
                      onChange={(e) => changePromoCode(e.target.value)}
                      className="min-w-0 flex-1"
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
                    <p className="text-xs text-primary mt-1">{promoMessage}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm mb-4 [&>div]:gap-3 [&>div>span:first-child]:min-w-0 [&>div>span:last-child]:shrink-0">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {setCount > 0 && <div className="flex justify-between text-primary"><span>Gaming set savings × {setCount}:</span><span>-${setDiscount.toFixed(2)}</span></div>}
                  {promoApplied && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({pricing.discountPercent}%):</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && subtotalCents <= 5000 && subtotal > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${((5001 - subtotalCents) / 100).toFixed(2)} more for free shipping.
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
                  disabled={isCheckingStock}
                >
                  {isCheckingStock ? "Checking stock..." : "Proceed to Checkout"}
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
          <SheetContent side="right" className="w-full max-w-full sm:max-w-md overflow-y-auto p-4 sm:p-6">
            <SheetHeader className="pr-8">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart
                <Badge variant="secondary" className="ml-auto">{cart.length}</Badge>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.variant.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 bg-card text-card-foreground rounded-lg sm:flex">
                        <div className="col-span-2 min-w-0 break-words sm:flex-1">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.variant.size} • {item.variant.concentration}</p>
                        </div>
                        <Select
                          value={item.quantity.toString()}
                          disabled={isCheckingStock}
                          onValueChange={(val) => updateQuantity(item.variant.id, parseInt(val))}
                        >
                          <SelectTrigger className="w-20 h-8 shrink-0 sm:w-16" aria-label={`Quantity for ${item.product.name}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {quantityOptions(item.variant.id).map(n => (
                              <SelectItem key={n} value={n.toString()}>
                                {n === 0 ? "Remove" : n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="font-semibold text-sm whitespace-nowrap text-right sm:w-16 sm:shrink-0">
                          ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {hasReferenceDecants && <p className="mb-3 text-xs text-muted-foreground">{hasTdgDecants ? "Designer bottle imagery identifies scent inspiration only. You receive a THE DUPE GOAT dupe or hybrid decant in each selected size—not the original pictured perfume." : "Gaming concept imagery is for reference only. Gaming fragrances ship in separate 30 mL decant bottles."}{hasTdgDecants && <><br />{affiliationDisclosure}</>}</p>}

                  {/* Promo Code */}
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Codes separated by spaces"
                        value={promoCode}
                        onChange={(e) => changePromoCode(e.target.value)}
                        className="min-w-0 flex-1"
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
                      <p className="text-xs text-primary mt-1">{promoMessage}</p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm mb-4 [&>div]:gap-3 [&>div>span:first-child]:min-w-0 [&>div>span:last-child]:shrink-0">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {setCount > 0 && <div className="flex justify-between text-primary"><span>Gaming set savings × {setCount}:</span><span>-${setDiscount.toFixed(2)}</span></div>}
                    {promoApplied && (
                      <div className="flex justify-between text-primary">
                        <span>Discount ({pricing.discountPercent}%):</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && subtotalCents <= 5000 && subtotal > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${((5001 - subtotalCents) / 100).toFixed(2)} more for free shipping.
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
                    disabled={isCheckingStock}
                    data-testid="button-checkout-mobile"
                  >
                    {isCheckingStock ? "Checking stock..." : "Proceed to Checkout"}
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
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

function ProductCard({ product, variants, cart, isCheckingStock, onAddToCart, onViewDetails }: {
  product: Product;
  variants: ProductVariant[];
  cart: CartItem[];
  isCheckingStock: boolean;
  onAddToCart: (variant: ProductVariant, product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}) {
  const isChicago = Boolean(chicagoBottleImages[product.name.toUpperCase()]);
  const gamingOffer = chicagoOffers.find(offer => offer.productId === product.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || "");

  const chicagoDecant = isChicago ? variants.find(v => v.size.replace(/\s/g, "").toLowerCase() === "30ml") : undefined;
  const selectedVariant = isChicago ? chicagoDecant : variants.find(v => v.id === selectedVariantId) || variants[0];
  const availableToAdd = Math.max(0, inventoryLimit(selectedVariant) -
    (cart.find(item => item.variant.id === selectedVariant?.id)?.quantity ?? 0));
  const maxQuantity = Math.min(5, availableToAdd);
  const selectedQuantity = Math.min(quantity, maxQuantity);
  useEffect(() => { setQuantity(previous => Math.max(1, Math.min(previous, maxQuantity))); }, [maxQuantity]);

  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(selectedVariant, product, selectedQuantity);
      setQuantity(1);
    }
  };

  const isLowStock = Boolean(selectedVariant && selectedVariant.totalInventory > 0 &&
    selectedVariant.remainingInventory / selectedVariant.totalInventory < 0.2);
  
  // Group variants into a nice display format
  const getVariantDisplay = (v: ProductVariant) => {
    return `${v.size} ${v.concentration} - $${v.price}`;
  };
  
  return (
    <Card className={`overflow-hidden rounded-none border transition-all duration-500 hover:-translate-y-1 ${isChicago ? "border-[#dc7895]/25 bg-[#25303a] hover:border-[#dc7895]/65" : "border-[#d4ad70]/20 bg-[#25303a] hover:border-[#d4ad70]/55"}`}>
      <CardContent className="p-0">
        <div className={`noir-grain relative flex h-80 items-center justify-center overflow-hidden ${isChicago ? "bg-[#202b36]" : "bg-[#242a2d] p-5"}`}>
          {!isChicago && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(177,139,78,.42),transparent_67%)] opacity-[0.16]" />}
          <img 
            src={chicagoBottleImages[product.name.toUpperCase()]} 
            alt={isChicago ? `Reference photo of ${product.name}; shipped decant bottle differs` : `${product.name} fragrance bottle`}
            className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.035]"
            data-testid={`img-product-${product.id}`}
          />
          {isChicago && <Badge className="absolute left-3 top-3 rounded-none border border-[#dc7895]/50 bg-[#171a20]/90 font-mono text-[9px] uppercase tracking-wide text-[#f1a0b5]">Reference photo · decant ships</Badge>}
          {selectedVariant && (
            <Badge 
              variant={isLowStock ? "destructive" : "secondary"} 
              className={`absolute top-3 right-3 rounded-none text-xs border-0 ${isLowStock ? 'bg-[#a94849] text-white' : 'bg-[#d4ad70] text-[#151a20]'}`}
            >
              {selectedVariant.remainingInventory > 0 ? `${selectedVariant.remainingInventory} left` : "Sold out"}
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-3">
            <p className={`font-mono text-[9px] font-semibold uppercase tracking-[0.2em] ${isChicago ? "text-[#dc7895]" : "text-[#d4ad70]"}`}>{isChicago ? "THE DUPE GOAT · Gaming originals" : "THE DUPE GOAT"}</p>
            <h3 className="mt-1 font-serif text-2xl text-[#f3ead8]">{product.name}</h3>
            {!isChicago && product.verseReference?.trim() && <p className="mt-1 text-xs font-medium text-white/50">{product.verseReference.replace('Revelation', 'REV').replace('–', '-')}</p>}
          </div>

          {!isChicago && product.bibleVerse?.trim() && <p className="mb-2 text-sm italic text-white/65">"{product.bibleVerse}"</p>}
          <p className="mb-4 text-sm leading-6 text-white/75">{product.description}</p>
          {gamingOffer && <HybridInspirations inspirations={gamingOffer.inspirations} />}
          {isChicago && <p className="mb-4 border-l-2 border-[#dc7895] pl-3 text-xs leading-5 text-white/75">Gaming concept imagery is for reference only. Your fragrance ships in a separate 30 mL decant bottle.</p>}
          <>
           {/* Only the 30 mL Chicago decant is offered; display the other sizes without creating purchasable variants. */}
           {isChicago ? (
             <div className="mb-4">
               <p className="mb-2 text-sm font-medium text-white">Decant size</p>
               <div className="grid grid-cols-4 gap-2" role="group" aria-label={`${product.name} decant sizes`}>
                 {[5, 10, 20, 30].map(size => {
                   const available = size === 30 && Boolean(chicagoDecant?.isActive && chicagoDecant.remainingInventory > 0);
                   return (
                     <button
                       key={size}
                       type="button"
                       disabled={!available}
                       aria-pressed={available}
                       onClick={() => { if (chicagoDecant) setSelectedVariantId(chicagoDecant.id); }}
                       className={`min-h-[66px] border px-1 py-2 text-center transition-colors ${available
                         ? "border-[#dc7895] bg-[#dc7895]/15 text-[#f3ead8] hover:bg-[#dc7895]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1a0b5]"
                         : "cursor-not-allowed border-white/15 bg-white/[0.03] text-white/40"}`}
                       data-testid={`size-${size}ml-${product.id}`}
                     >
                       <span className={`block text-sm font-semibold ${!available ? "line-through decoration-white/35" : ""}`}>{size} mL</span>
                       <span className={`mt-1 block text-[10px] leading-tight ${available ? "text-[#f1a0b5]" : "text-white/45"}`}>
                         {available ? "Available" : "Not available"}
                       </span>
                     </button>
                   );
                 })}
               </div>
             </div>
           ) : (
             <div className="mb-4">
               <label className="text-sm font-medium text-white mb-2 block">Select Size & Concentration:</label>
               <Select value={selectedVariantId || variants[0]?.id} onValueChange={setSelectedVariantId}>
                 <SelectTrigger className="w-full rounded-none border-[#d4ad70]/30 bg-[#12181e] text-white hover:bg-[#1d262d]" data-testid={`select-variant-${product.id}`}>
                   <SelectValue placeholder="Choose an option" />
                 </SelectTrigger>
                 <SelectContent className="bg-luxury-black border-champagne/30">
                   {variants.map(variant => (
                     <SelectItem key={variant.id} value={variant.id} className="text-white hover:bg-champagne/20 focus:bg-champagne/20">
                       {getVariantDisplay(variant)}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           )}

           {selectedVariant && isChicago && <div className="mb-4 border border-[#dc7895]/40 bg-[#dc7895]/10 px-3 py-2 text-sm text-[#f1a0b5]">
             <strong>{selectedVariant.remainingInventory > 0 ? `${selectedVariant.remainingInventory} of ${selectedVariant.totalInventory} left` : "Sold out"}</strong>
             <span className="ml-2 text-[#f3ead8]/70">· Limited 30 mL run</span>
           </div>}

          <div className="flex items-center justify-between mb-4">
            <div>
               <p className="text-2xl font-bold text-[#d4ad70]">
                {selectedVariant ? `$${selectedVariant.price}` : "Unavailable"}
              </p>
              {selectedVariant && (
                <p className="text-xs text-white/60">{selectedVariant.size} • {selectedVariant.concentration}</p>
              )}
            </div>
            <Select value={selectedQuantity > 0 ? selectedQuantity.toString() : ""} disabled={!availableToAdd || isCheckingStock} onValueChange={(val) => setQuantity(parseInt(val))}>
              <SelectTrigger className="w-20 rounded-none border-[#d4ad70]/30 bg-[#12181e] text-white hover:bg-[#1d262d]" data-testid={`select-quantity-${product.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-luxury-black border-champagne/30">
                {Array.from({ length: maxQuantity }, (_, n) => n + 1).map(n => (
                  <SelectItem key={n} value={n.toString()} className="text-white hover:bg-champagne/20 focus:bg-champagne/20">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={!availableToAdd || isCheckingStock}
              className="flex-1 rounded-none bg-[#d4ad70] text-[#151a20] hover:bg-[#e3c28e]"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {availableToAdd > 0 ? "Add to Cart" : selectedVariant && selectedVariant.remainingInventory > 0 ? "All available stock in cart" : "Out of Stock"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewDetails(product)}
              className="rounded-none border-[#d4ad70]/30 bg-[#12181e] text-[#d4ad70] hover:bg-[#d4ad70]/10"
              data-testid={`button-view-details-${product.id}`}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
          </>
        </div>
      </CardContent>
    </Card>
  );
}
