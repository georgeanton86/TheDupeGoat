import { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PayPalButton from "@/components/PayPalButton";

const CheckoutForm = ({ product }: { product: any }) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = async (paypalOrderId: string) => {
    if (!policyAcknowledged) {
      toast({
        title: "Policy Acknowledgment Required",
        description: "You must acknowledge our no-return policy to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!customerEmail || !customerName) {
      toast({
        title: "Required Information Missing",
        description: "Please fill in your email and name before completing payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/complete-paypal-payment", {
        paypalOrderId,
        productId: product.id,
        customerEmail,
        customerName,
        policyAcknowledged,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        setLocation("/?payment=success");
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Secure Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              <div className="flex justify-between items-center">
                <span>{product.name} ({product.volume})</span>
                <span className="font-semibold">${product.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${product.price}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                data-testid="input-name"
              />
            </div>

            {/* Policy Acknowledgment */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="policy"
                    checked={policyAcknowledged}
                    onCheckedChange={setPolicyAcknowledged}
                    required
                    data-testid="checkbox-policy"
                  />
                  <Label htmlFor="policy" className="text-sm text-gray-700 leading-relaxed">
                    I acknowledge and agree to the <strong>NO RETURN, NO REFUND</strong> policy. Due to hygiene regulations, all fragrance sales are final.
                  </Label>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="border rounded-lg p-8 text-center">
                <PayPalButton
                  amount={product.price}
                  currency="USD"
                  intent="CAPTURE"
                />
                <p className="text-sm text-gray-500 mt-4">
                  Pay securely with PayPal, credit card, or debit card
                </p>
              </div>
            </div>
            
            {isProcessing && (
              <div className="text-center p-4">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing your payment...</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              <i className="fas fa-lock mr-1"></i>
              Your payment information is secure and encrypted
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/product"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <p>Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <CheckoutForm product={product} />
      </div>
      <Footer />
    </div>
  );
}
