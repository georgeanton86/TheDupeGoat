import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

export default function ProductGallery() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-luxury-black mb-4">Our Collections</h2>
          <div className="animate-pulse grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to select the correct bottle image based on product name
  const getBottleImage = (productName: string) => {
    switch (productName) {
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
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-amber-600 mb-4">Our Collections</h2>
        <p className="text-amber-600/80 max-w-2xl mx-auto">
          Discover our exclusive fragrances - from sold-out successes to upcoming pre-orders
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {products?.map((product: any) => {
          const isPreOrder = new Date(product.releaseDate) > new Date();
          const isSoldOut = product.remainingInventory === 0;
          
          return (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black flex items-center justify-center p-8">
                <img 
                  src={getBottleImage(product.name)}
                  alt={`${product.name} - RVLTN Parfums`}
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <Badge className={`absolute top-4 right-4 ${
                  isPreOrder 
                    ? "bg-champagne text-luxury-black" 
                    : isSoldOut 
                      ? "bg-red-600 text-white" 
                      : "bg-champagne text-luxury-black"
                }`}>
                  {isPreOrder ? "PRE-ORDER" : isSoldOut ? "SOLD OUT" : "AVAILABLE"}
                </Badge>
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-serif font-bold text-amber-600 mb-2">
                  {product.name}
                </h3>
                <p className="text-amber-600/80 mb-4 text-sm">
                  {product.description}
                </p>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold text-amber-600">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {isSoldOut ? (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-medium mb-2">
                      ✨ {product.totalInventory} bottles sold
                    </p>
                    {product.selloutTime && (
                      <p className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded mb-2">
                        ⚡ Sold out in {product.selloutTime}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      This limited edition is completely sold out
                    </p>
                  </div>
                ) : isPreOrder ? (
                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button className="w-full bg-champagne text-luxury-black hover:bg-yellow-500">
                        🌟 Pre-Order Now
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-600">
                      Blessed Release: September 1st, 2025
                    </p>
                  </div>
                ) : (
                  <Link href="/checkout">
                    <Button className="w-full bg-luxury-black text-white hover:bg-charcoal">
                      Buy Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Product Disclaimer */}
      <div className="mt-16 text-center bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-3xl mx-auto">
        <p className="text-sm text-amber-900 font-medium mb-2">
          ⚠️ Product Image Disclaimer
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          *Product images shown are AI-generated concept renderings for illustration purposes only. Actual bottle designs, colors, shapes, and packaging will vary from images shown. Each fragrance is handcrafted and bottled individually. Final product appearance is subject to change.
        </p>
      </div>
    </div>
  );
}