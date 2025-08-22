import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductShowcase from "@/components/product-showcase";
import ProductGallery from "@/components/product-gallery";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section id="featured" className="pt-16 min-h-screen bg-gradient-to-br from-warm-gray to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative">
          <ProductShowcase />
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="bg-warm-gray">
        <ProductGallery />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-serif font-bold text-luxury-black mb-4">The RVLTN Promise</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every fragrance tells a story. Ours speaks of rebellion, luxury, and the art of standing apart.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-certificate text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Artisan Crafted</h4>
                <p className="text-gray-600">
                  Hand-blended by master perfumers using only the finest raw materials sourced globally.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Ultra Exclusive</h4>
                <p className="text-gray-600">
                  Limited to 100 bottles monthly. Once they're gone, they're gone forever.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-shipping-fast text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Swift Delivery</h4>
                <p className="text-gray-600">
                  Complimentary worldwide express shipping with discrete, luxury packaging.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="RVLTN Parfums Artisan Laboratory" 
                className="rounded-2xl shadow-xl w-full h-auto" 
              />
            </div>
            
            <div>
              <h3 className="text-4xl font-serif font-bold text-luxury-black mb-6">Born from Rebellion</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                RVLTN Parfums was born from a simple belief: luxury shouldn't be mass-produced. Each month, we craft a single, extraordinary fragrance in extremely limited quantities.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our philosophy is revolution through scent—challenging the traditional perfume industry with bold, uncompromising compositions that refuse to follow trends.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-champagne mr-3"></i>
                  <span className="text-gray-700">Master perfumer collaborations</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-champagne mr-3"></i>
                  <span className="text-gray-700">Sustainably sourced ingredients</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-champagne mr-3"></i>
                  <span className="text-gray-700">No mass production, ever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
