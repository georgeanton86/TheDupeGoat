import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Loader2, CheckCircle } from "lucide-react";
import type { Product, ProductVariant } from "@shared/schema";
import { chicagoSetDiscountCents, countChicagoSets, decantDisclosure, isChicagoVariant } from "@shared/chicago";

interface CartItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
}

function CheckoutForm({ total, clientSecret, onSuccess }: {
  total: number; clientSecret: string; onSuccess: (result: any) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidIntentId, setPaidIntentId] = useState<string | null>(null);

  const confirmOrder = async (paymentIntentId: string) => {
    const response = await apiRequest("POST", "/api/complete-stripe-payment", {
      paymentIntentId, clientSecret,
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Could not confirm order");
    onSuccess(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    let paymentCaptured = Boolean(paidIntentId);

    try {
      if (paidIntentId) {
        await confirmOrder(paidIntentId);
        return;
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/checkout",
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        paymentCaptured = true;
        setPaidIntentId(paymentIntent.id);
        await confirmOrder(paymentIntent.id);
      } else {
        toast({ title: "Payment pending", description: "Please wait for payment confirmation." });
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: "Order Error",
        description: paymentCaptured
          ? "Your payment succeeded, but we could not confirm the order. Retry confirmation; do not pay again."
          : err.message || "Something went wrong. Please contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-luxury-black text-white hover:bg-charcoal"
        size="lg"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          paidIntentId ? "Retry order confirmation" : `Pay $${total.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const [decantAcknowledged, setDecantAcknowledged] = useState(false);
  const [address, setAddress] = useState({
    line1: "", line2: "", city: "", state: "", postal_code: "", country: "US",
  });

  const finishOrder = (data: any) => {
    localStorage.removeItem("checkoutCart");
    sessionStorage.setItem("checkoutConfirmation", JSON.stringify(data));
    window.history.replaceState({}, "", "/checkout?order=success");
    setOrderData(data);
    setShowSuccess(true);
  };

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: variants } = useQuery<ProductVariant[]>({
    queryKey: ["/api/product-variants"],
  });
  const hasChicagoDecant = cartItems.some(item => isChicagoVariant(item.variant.id));
  const setCount = countChicagoSets(cartItems.map(item => ({ variantId: item.variant.id, quantity: item.quantity })));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") {
      try {
        const saved = sessionStorage.getItem("checkoutConfirmation");
        if (saved) {
          setOrderData(JSON.parse(saved));
          setShowSuccess(true);
          setIsLoadingCart(false);
          return;
        }
      } catch {
        sessionStorage.removeItem("checkoutConfirmation");
      }
    }
    const paymentIntentId = params.get("payment_intent");
    const returnedSecret = params.get("payment_intent_client_secret");
    if (paymentIntentId && returnedSecret) {
      apiRequest("POST", "/api/complete-stripe-payment", {
        paymentIntentId, clientSecret: returnedSecret,
      }).then(res => res.json()).then(data => {
        if (!data.success) throw new Error(data.message || "Payment could not be confirmed");
        finishOrder(data);
      }).catch(() => {
        setError("We couldn't confirm your payment yet. Please reload this page to retry. Do not pay again.");
      });
      setIsLoadingCart(false);
      return;
    }

    const cartDataStr = localStorage.getItem('checkoutCart');
    if (!cartDataStr) {
      setLocation('/shop');
      return;
    }

    try {
      const cartData = JSON.parse(cartDataStr);
      
      // Wait for products and variants to load
      if (!products || !variants) {
        return;
      }

      // Build cart items from variant IDs
      const items: CartItem[] = [];
      for (const cartItem of cartData.cart) {
        const variant = variants.find(v => v.id === cartItem.variantId);
        if (!variant) continue;
        
        const product = products.find(p => p.id === variant.productId);
        if (!product) continue;

        items.push({
          variant,
          product,
          quantity: cartItem.quantity
        });
      }

      if (items.length === 0) {
        setLocation('/shop');
        return;
      }

      setCartItems(items);
      setPromoCode(cartData.promoCode);
      setIsLoadingCart(false);
    } catch (error) {
      console.error('Cart parsing error:', error);
      setLocation('/shop');
    }
  }, [setLocation, products, variants]);

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyAcknowledged) {
      setError("Please accept the no-returns policy before paying.");
      return;
    }
    if (hasChicagoDecant && !decantAcknowledged) {
      setError("Please acknowledge that the decant bottle differs from the illustration.");
      return;
    }
    setIsPreparing(true);
    setError("");
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        items: cartItems.map(item => ({ variantId: item.variant.id, quantity: item.quantity })),
        promoCode, customerEmail, customerName, policyAcknowledged, decantAcknowledged, address,
      });
      const data = await response.json();
      const configResponse = await fetch("/api/stripe/config");
      if (!configResponse.ok) throw new Error("Payments are unavailable");
      const config = await configResponse.json();
      setStripePromise(loadStripe(config.publishableKey));
      setClientSecret(data.clientSecret);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not prepare checkout");
    } finally {
      setIsPreparing(false);
    }
  };

  if (showSuccess && orderData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card className="border-2 border-green-500">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl font-serif text-green-700">Order Confirmed!</CardTitle>
              <CardDescription>Thank you for your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Order Total:</strong> ${orderData.total}</p>
                <p className="text-sm"><strong>Email:</strong> {orderData.customerEmail}</p>
                <p className="text-sm"><strong>Order ID:</strong> {orderData.orderId}</p>
                <p className="text-sm text-gray-600">Keep this order ID for your records.</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Important:</strong> All sales are final. No returns or exchanges accepted per our policy.
                </p>
              </div>
              <Button
                onClick={() => setLocation('/shop')}
                className="w-full"
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoadingCart || new URLSearchParams(window.location.search).has("payment_intent") && !error && !showSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-champagne" />
            <p className="text-lg text-gray-600">Preparing secure checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Secure Checkout</CardTitle>
            <CardDescription>Complete your purchase securely with Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
            {!clientSecret && !new URLSearchParams(window.location.search).has("payment_intent") && (
              <form onSubmit={startPayment} className="space-y-4">
                <div className="space-y-2 pb-4 border-b">
                  <h3 className="font-semibold">Order summary</h3>
                  {cartItems.map(item => <div key={item.variant.id} className="flex justify-between text-sm">
                     <span>{item.product.name} ({item.variant.size} {item.variant.concentration}) × {item.quantity}</span>
                    <span>${(Number(item.variant.price) * item.quantity).toFixed(2)}</span>
                  </div>)}
                   {setCount > 0 && <div className="flex justify-between text-sm text-green-700"><span>Gaming set savings × {setCount}</span><span>-${(setCount * chicagoSetDiscountCents / 100).toFixed(2)}</span></div>}
                   {hasChicagoDecant && <p className="mt-3 border-l-2 border-[#dc7895] pl-3 text-sm text-gray-700">{decantDisclosure}</p>}
                  <p className="text-sm text-gray-600">Shipping and discount are included in the final payment total.</p>
                </div>
                <div><Label htmlFor="name">Full name</Label><Input id="name" required value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} /></div>
                <h3 className="font-semibold pt-2">Delivery address (US)</h3>
                {([
                  ["line1", "Street address"], ["line2", "Apartment or suite (optional)"],
                  ["city", "City"], ["state", "State"], ["postal_code", "ZIP code"],
                ] as const).map(([key, label]) => (
                  <div key={key}><Label htmlFor={key}>{label}</Label>
                    <Input id={key} required={key !== "line2"} value={address[key]}
                      onChange={e => setAddress(previous => ({ ...previous, [key]: e.target.value }))} />
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <Checkbox id="policy" checked={policyAcknowledged} onCheckedChange={checked => setPolicyAcknowledged(checked === true)} />
                  <label htmlFor="policy" className="text-sm">I accept the <a href="/policy" target="_blank" rel="noopener noreferrer" className="underline">no-returns policy</a>. All sales are final.</label>
                </div>
                {hasChicagoDecant && <div className="flex items-start gap-2">
                  <Checkbox id="decant" checked={decantAcknowledged} onCheckedChange={checked => { setDecantAcknowledged(checked === true); setError(""); }} />
                  <label htmlFor="decant" className="text-sm">I understand the pictured bottle is for reference and my fragrance will arrive in a different 30 mL decant bottle.</label>
                </div>}
                <Button type="submit" disabled={isPreparing || !policyAcknowledged} className="w-full">
                  {isPreparing ? "Preparing payment..." : "Continue to payment"}
                </Button>
              </form>
            )}
            {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm total={total} clientSecret={clientSecret} onSuccess={finishOrder} />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
