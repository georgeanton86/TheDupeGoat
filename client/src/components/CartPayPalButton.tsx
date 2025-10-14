import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartPayPalButtonProps {
  items: CartItem[];
  promoCode: string | null;
  onApprove: (paypalOrderId: string) => Promise<void>;
  disabled?: boolean;
}

export default function CartPayPalButton({
  items,
  promoCode,
  onApprove,
  disabled = false,
}: CartPayPalButtonProps) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async () => {
    const orderPayload = {
      items,
      promoCode,
    };
    
    const response = await fetch("/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create PayPal order");
    }
    
    const output = await response.json();
    return { orderId: output.id };
  };

  const onCancelHandler = (data: any) => {
    console.log("PayPal payment cancelled", data);
    setIsLoading(false);
  };

  const onErrorHandler = (error: any) => {
    console.error("PayPal payment error", error);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        if (!(window as any).paypal) {
          const script = document.createElement("script");
          script.src = import.meta.env.PROD
            ? "https://www.paypal.com/web-sdk/v6/core"
            : "https://www.sandbox.paypal.com/web-sdk/v6/core";
          script.async = true;
          script.onload = () => initPayPal();
          document.body.appendChild(script);
        } else {
          await initPayPal();
        }
      } catch (e) {
        console.error("Failed to load PayPal SDK", e);
      }
    };

    loadPayPalSDK();
  }, []);

  const initPayPal = async () => {
    try {
      const clientToken: string = await fetch("/paypal/setup")
        .then((res) => res.json())
        .then((data) => data.clientToken);

      const sdkInstance = await (window as any).paypal.createInstance({
        clientToken,
        components: ["paypal-payments"],
      });

      const paypalCheckout = sdkInstance.createPayPalOneTimePaymentSession({
        onApprove: async (data: any) => {
          console.log("PayPal payment approved", data);
          setIsLoading(true);
          try {
            await onApprove(data.orderId);
          } catch (error) {
            console.error("Payment completion error", error);
            setIsLoading(false);
          }
        },
        onCancel: onCancelHandler,
        onError: onErrorHandler,
      });

      const onClick = async () => {
        if (disabled) return;
        
        try {
          setIsLoading(true);
          const checkoutOptionsPromise = createOrder();
          await paypalCheckout.start(
            { paymentFlow: "auto" },
            checkoutOptionsPromise,
          );
        } catch (e) {
          console.error("PayPal checkout error", e);
          setIsLoading(false);
        }
      };

      const paypalButton = document.getElementById("cart-paypal-button");
      if (paypalButton) {
        paypalButton.addEventListener("click", onClick);
      }

      setIsSDKReady(true);

      return () => {
        if (paypalButton) {
          paypalButton.removeEventListener("click", onClick);
        }
      };
    } catch (e) {
      console.error("PayPal initialization error", e);
    }
  };

  if (!isSDKReady) {
    return (
      <Button disabled className="w-full" data-testid="button-paypal-loading">
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
        Loading PayPal...
      </Button>
    );
  }

  return (
    <paypal-button 
      id="cart-paypal-button" 
      className={disabled || isLoading ? "opacity-50 pointer-events-none" : ""}
      data-testid="button-paypal-checkout"
    />
  );
}
