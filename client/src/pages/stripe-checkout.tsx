import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
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

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ total, cart, promoCode }: { total: number; cart: any[]; promoCode: string | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail || !customerName) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email",
        variant: "destructive",
      });
      return;
    }

    if (!policyAcknowledged) {
      toast({
        title: "Policy Required",
        description: "Please acknowledge our no-returns policy",
        variant: "destructive",
      });
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/shop?payment=success",
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
        // Complete the order on the backend
        const response = await apiRequest("POST", "/api/complete-stripe-payment", {
          paymentIntentId: paymentIntent.id,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          })),
          customerEmail,
          customerName,
          policyAcknowledged,
          promoCode
        });

        const result = await response.json();

        if (result.success) {
          // Clear cart data
          localStorage.removeItem('checkoutCart');
          
          // Store success data for confirmation page
          localStorage.setItem('orderSuccess', JSON.stringify({
            orderIds: result.orderIds,
            total: result.total,
            customerEmail,
            customerName
          }));

          toast({
            title: "Payment Successful!",
            description: "Your order has been confirmed",
          });

          setLocation('/shop?payment=success');
        } else {
          throw new Error(result.message || 'Failed to complete order');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: "Order Error",
        description: err.message || "Something went wrong. Please contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Doe"
            required
            data-testid="input-customer-name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="john@example.com"
            required
            data-testid="input-customer-email"
          />
        </div>
      </div>

      <PaymentElement />

      <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
        <Checkbox
          id="policy"
          checked={policyAcknowledged}
          onCheckedChange={(checked) => setPolicyAcknowledged(checked as boolean)}
          data-testid="checkbox-policy"
        />
        <label htmlFor="policy" className="text-sm leading-tight cursor-pointer">
          I acknowledge and accept the <a href="/policy" target="_blank" className="text-blue-600 hover:underline">no-returns policy</a>. All sales are final.
        </label>
      </div>

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
          `Pay $${total.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Check for success state from URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const successData = localStorage.getItem('orderSuccess');
      if (successData) {
        setShowSuccess(true);
        setOrderData(JSON.parse(successData));
        localStorage.removeItem('orderSuccess');
        localStorage.removeItem('checkoutCart');
      }
      return;
    }

    const cartData = localStorage.getItem('checkoutCart');
    if (!cartData) {
      setLocation('/shop');
      return;
    }

    const { cart: cartItems, promoCode: code } = JSON.parse(cartData);
    setCart(cartItems);
    setPromoCode(code);
    
    apiRequest("POST", "/api/create-payment-intent", { 
      items: cartItems.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      promoCode: code
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setTotal(data.total);
      })
      .catch((error) => {
        console.error('Payment intent error:', error);
        setLocation('/shop');
      });
  }, [setLocation]);

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
                <p className="text-sm text-gray-600">A confirmation email has been sent to your inbox.</p>
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

  if (!clientSecret) {
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
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm total={total} cart={cart} promoCode={promoCode} />
            </Elements>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
