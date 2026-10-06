import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartPayPalButton from "@/components/CartPayPalButton";
import type { Product, ProductVariant } from "@shared/schema";
import { shippingCentsForSubtotal } from "@shared/commerce";

interface CartData {
  cart: Array<{
    variantId: string;
    quantity: number;
  }>;
  promoCode: string | null;
}

interface CheckoutItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

const CheckoutForm = ({ checkoutData }: { checkoutData: CheckoutData }) => {
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
        items: checkoutData.items.map(item => ({
          variantId: item.variant.id,
          quantity: item.quantity
        })),
        customerEmail,
        customerName,
        policyAcknowledged,
        promoCode: checkoutData.promoCode
      });

      const result = await response.json();

      if (result.success) {
        localStorage.removeItem('checkoutCart');
        
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
              
              {checkoutData.items.map((item) => (
                <div key={item.variant.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    {item.product.name} ({item.variant.size} {item.variant.concentration}) x {item.quantity}
                  </span>
                  <span className="font-semibold text-sm">
                    ${(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr className="my-3" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>${checkoutData.subtotal.toFixed(2)}</span>
                </div>
                
                {checkoutData.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({checkoutData.promoCode})</span>
                    <span>-${checkoutData.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className={checkoutData.shipping === 0 ? "text-green-600" : ""}>
                    {checkoutData.shipping === 0 ? "FREE" : `$${checkoutData.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <hr className="my-3" />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${checkoutData.total.toFixed(2)}</span>
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
                    onCheckedChange={(checked) => setPolicyAcknowledged(checked === true)}
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
                <CartPayPalButton
                  items={checkoutData.items.map(item => ({
                    variantId: item.variant.id,
                    quantity: item.quantity
                  }))}
                  promoCode={checkoutData.promoCode}
                  onApprove={handlePayPalPayment}
                  disabled={!policyAcknowledged || !customerEmail || !customerName || isProcessing}
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
  const [, setLocation] = useLocation();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: variants } = useQuery<ProductVariant[]>({
    queryKey: ["/api/product-variants"],
  });

  useEffect(() => {
    const cartDataStr = localStorage.getItem('checkoutCart');
    if (!cartDataStr) {
      setLocation('/shop');
      return;
    }

    try {
      const cartData = JSON.parse(cartDataStr) as CartData;
      if (!cartData.cart || cartData.cart.length === 0) {
        setLocation('/shop');
        return;
      }

      // Wait for both products and variants to be loaded
      if (!products || !variants) {
        return;
      }

      // Build checkout data from cart
      const items: CheckoutItem[] = [];
      
      for (const cartItem of cartData.cart) {
        const variant = variants.find(v => v.id === cartItem.variantId);
        if (!variant) {
          console.error(`Variant ${cartItem.variantId} not found`);
          continue;
        }
        
        const product = products.find(p => p.id === variant.productId);
        if (!product) {
          console.error(`Product ${variant.productId} not found`);
          continue;
        }

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

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0);
      const discount = cartData.promoCode?.toUpperCase() === "WELCOME10" ? subtotal * 0.1 : 0;
      const shipping = shippingCentsForSubtotal(Math.round(subtotal * 100)) / 100;
      const total = subtotal - discount + shipping;

      setCheckoutData({
        items,
        promoCode: cartData.promoCode,
        subtotal,
        discount,
        shipping,
        total
      });
    } catch (error) {
      console.error('Error parsing cart data:', error);
      setLocation('/shop');
    }
  }, [setLocation, products, variants]);

  if (!checkoutData) {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <CheckoutForm checkoutData={checkoutData} />
      </div>
      <Footer />
    </div>
  );
}
