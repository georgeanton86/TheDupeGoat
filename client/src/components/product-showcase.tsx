import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./countdown-timer";
import type { Product } from "@shared/schema";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

export default function ProductShowcase() {
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/product"],
  });

  const { data: inventory } = useQuery<{ remaining: number; total: number }>({
    queryKey: ["/api/inventory", product?.id],
    enabled: !!product?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Check if this is a pre-order product (release date is in the future)
  const isPreOrder = product && new Date(product.releaseDate) > new Date();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="w-80 h-96 bg-gray-200 rounded-2xl mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-luxury-black">No Product Available</h2>
          <p className="text-gray-600 mt-4">Check back soon for our next limited release.</p>
        </div>
      </div>
    );
  }

  const remaining = inventory?.remaining ?? product.remainingInventory;
  const total = inventory?.total ?? product.totalInventory;

  // Select bottle image based on product name
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Product Showcase */}
        <div className="order-2 lg:order-1">
          <div className="text-center lg:text-left">
            {/* Scarcity Badge */}
            {isPreOrder ? (
              <Badge variant="secondary" className="mb-6 bg-champagne text-luxury-black animate-pulse" data-testid="badge-pre-order">
                <span className="w-2 h-2 bg-luxury-black rounded-full mr-2 animate-pulse"></span>
                PRE-ORDER NOW - <span className="font-semibold ml-1">{total}</span> bottles available
              </Badge>
            ) : remaining > 0 ? (
              <Badge variant="destructive" className="mb-6 bg-champagne text-luxury-black animate-pulse" data-testid="badge-inventory">
                <span className="w-2 h-2 bg-luxury-black rounded-full mr-2 animate-pulse"></span>
                LIMITED EDITION - <span className="font-semibold ml-1">{remaining}</span> of {total} remaining
              </Badge>
            ) : (
              <Badge variant="secondary" className="mb-6 bg-red-600 text-white" data-testid="badge-sold-out">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                SOLD OUT - <span className="font-semibold ml-1">{total}</span> bottles sold
              </Badge>
            )}
            
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-champagne mb-2 leading-tight">
              {product.name}
            </h2>
            <p className="text-lg text-champagne/70 font-medium mb-4">
              {product.verseReference.replace('Revelation', 'REV').replace('–', '-')}
            </p>
            
            <p className="text-xl text-champagne/80 mb-6 leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* Bible Verse */}
            <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg max-w-lg">
              <p className="text-sm text-champagne/90 italic leading-relaxed">
                "{product.bibleVerse}"
              </p>
              <p className="text-xs text-champagne/70 font-medium mt-2 text-right">
                — {product.verseReference}
              </p>
            </div>
            
            {/* Product Details */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-sm font-medium text-champagne/60 w-24">Volume:</span>
                <span className="text-sm font-semibold text-white">{product.volume}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-sm font-medium text-champagne/60 w-24">Notes:</span>
                <span className="text-sm text-champagne/80">{product.notes}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-sm font-medium text-champagne/60 w-24">Type:</span>
                <span className="text-sm text-champagne/80">{product.type}</span>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="text-center lg:text-left mb-10">
              <span className="text-4xl font-serif font-bold text-champagne" data-testid="text-price">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-champagne/50 line-through ml-3">
                  ${product.originalPrice}
                </span>
              )}
              <div className="text-sm text-white/80 font-medium mt-1">Limited Release Pricing</div>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link href="/shop">
                <Button 
                  className="w-full lg:w-auto bg-champagne text-luxury-black px-12 py-4 text-lg font-semibold tracking-wide hover:bg-champagne/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                  data-testid="button-shop-now"
                >
                  SHOP NOW
                </Button>
              </Link>
              <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 p-4 rounded-lg">
                <h4 className="font-semibold text-champagne mb-2">✨ What's Included:</h4>
                <ul className="text-sm text-champagne/80 space-y-1">
                  <li>✓ 8 powerful biblical fragrances</li>
                  <li>✓ FREE shipping over $100</li>
                  <li>✓ Use code WELCOME10 for 10% off</li>
                  <li>✓ One-click PayPal checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Image */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative group">
            {/* Main bottle image */}
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black flex items-center justify-center">
              <img 
                src={getBottleImage()} 
                alt={`${product.name} - RVLTN Parfums Limited Edition`} 
                className="h-80 w-auto object-contain"
                data-testid="img-product"
              />
            </div>
            
            {/* Floating Badge */}
            <Badge className={`absolute -top-4 -right-4 shadow-lg ${
              isPreOrder 
                ? "bg-champagne text-luxury-black" 
                : remaining > 0 
                  ? "bg-champagne text-luxury-black" 
                  : "bg-red-600 text-white"
            }`}>
              {isPreOrder ? "PRE-ORDER" : remaining > 0 ? "NEW" : "SOLD OUT"}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Countdown Timer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <CountdownTimer nextReleaseDate={product.releaseDate.toString()} isPreOrder={isPreOrder} />
      </div>
    </div>
  );
}
