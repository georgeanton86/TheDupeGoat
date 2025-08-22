import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductShowcase from "@/components/product-showcase";
import ProductGallery from "@/components/product-gallery";
import creatorImage from "@assets/Screenshot_20250822_065742_Photos_1755864649303.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Simple visitor counter component
function VisitorCounter() {
  const [visitors, setVisitors] = useState(Math.floor(Math.random() * 8) + 3); // 3-10 current viewers
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic visitor fluctuations
      const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      setVisitors(prev => Math.max(1, Math.min(15, prev + change)));
    }, 8000 + Math.random() * 12000); // 8-20 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-6 right-6 bg-white border-2 border-champagne rounded-full px-4 py-2 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-luxury-black">
          {visitors} viewing now
        </span>
      </div>
    </div>
  );
}

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

      {/* Biblical Foundation - Revelation 2:16 */}
      <section className="py-16 bg-gradient-to-r from-luxury-black to-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="text-champagne text-sm font-medium tracking-wider uppercase">
              Revelation 2:16 - Our Foundation
            </span>
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
            "Repent therefore! Otherwise, I will soon come to you and will fight against them with the sword of my mouth."
          </blockquote>
          <cite className="text-champagne text-lg font-medium">
            — Revelation 2:16
          </cite>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            Like the sword of His mouth, our fragrances carry power and purpose. Each scent is crafted to awaken the senses and stir the soul toward divine transformation.
          </p>
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
            <h3 className="text-3xl font-serif font-bold text-luxury-black mb-4">Our Sacred Promise</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every fragrance tells a story of faith. Ours speaks of divine inspiration, sacred luxury, and the art of worship through scent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-certificate text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Divinely Crafted</h4>
                <p className="text-gray-600">
                  Hand-blended with prayer and devotion using sacred ingredients blessed through ancient traditions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Blessed & Limited</h4>
                <p className="text-gray-600">
                  Limited to 100 blessed bottles monthly. Each one is a unique blessing that cannot be replicated.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-shipping-fast text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4">Sacred Delivery</h4>
                <p className="text-gray-600">
                  Careful packaging and blessed handling for each precious fragrance when available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Creator Biography Section */}
      <section id="about" className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={creatorImage} 
                alt="Master Perfumer and Founder" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover" 
                style={{objectPosition: "center 20%"}}
              />
            </div>
            
            <div>
              <h3 className="text-4xl font-serif font-bold text-luxury-black mb-6">Called to Create</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                My journey as a perfumer began as a divine calling. Inspired by the biblical tradition of sacred oils and fragrances, I dedicated my life to creating scents that honor God and uplift the spirit.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Each fragrance is crafted through prayer and meditation, using ingredients mentioned in scripture—frankincense, myrrh, and sacred roses. My mission is to create fragrances that serve as a form of worship and inspire others in their faith journey.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                "Like a sweet fragrance rising to heaven, may these scents be a blessing to all who wear them." - Psalm 141:2
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-cross text-champagne mr-3"></i>
                  <span className="text-gray-700">Biblical inspiration in every blend</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-heart text-champagne mr-3"></i>
                  <span className="text-gray-700">Crafted with prayer and devotion</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-dove text-champagne mr-3"></i>
                  <span className="text-gray-700">Blessed ingredients from sacred sources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <VisitorCounter />
    </div>
  );
}
