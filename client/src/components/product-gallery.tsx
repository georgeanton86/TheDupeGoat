import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import summerOfSinghsImage from "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png";
import septemberBlessingImage from "@assets/Screenshot_20250822_065610_Chrome_1755863790682.jpg";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-luxury-black mb-4">Our Collections</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our exclusive fragrances - from sold-out successes to upcoming pre-orders
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {products?.map((product: any) => {
          const isPreOrder = new Date(product.releaseDate) > new Date();
          const isSoldOut = product.remainingInventory === 0;
          
          return (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={
                    product.name === "Summer of Singhs" ? summerOfSinghsImage : 
                    product.name === "September's Blessing" ? septemberBlessingImage :
                    product.imageUrl
                  }
                  alt={`${product.name} - RVLTN Parfums`}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
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
                <h3 className="text-2xl font-serif font-bold text-luxury-black mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold text-luxury-black">
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
    </div>
  );
}