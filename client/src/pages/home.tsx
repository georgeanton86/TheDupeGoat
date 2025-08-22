import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductShowcase from "@/components/product-showcase";
import ProductGallery from "@/components/product-gallery";
import creatorImage from "@assets/Screenshot_20250822_065742_Photos_1755864649303.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Fun visitor counter with animations
function VisitorCounter() {
  const [visitors, setVisitors] = useState(Math.floor(Math.random() * 8) + 3);
  const [isHovered, setIsHovered] = useState(false);
  const [showWow, setShowWow] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      const newCount = Math.max(1, Math.min(15, visitors + change));
      setVisitors(newCount);
      
      // Show "wow" effect on big jumps
      if (Math.abs(change) > 0 && newCount > visitors) {
        setShowWow(true);
        setTimeout(() => setShowWow(false), 2000);
      }
    }, 8000 + Math.random() * 12000);
    
    return () => clearInterval(interval);
  }, [visitors]);
  
  return (
    <div 
      className="fixed bottom-6 right-6 bg-white border-2 border-champagne rounded-full px-4 py-2 shadow-lg z-50 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 bg-green-500 rounded-full ${isHovered ? 'animate-bounce' : 'animate-pulse'}`}></div>
        <span className="text-sm font-medium text-luxury-black">
          {visitors} {isHovered ? 'blessed souls' : 'viewing now'}
        </span>
        {showWow && (
          <span className="text-xs text-champagne animate-bounce">🔥</span>
        )}
      </div>
    </div>
  );
}

// Fun fragrance facts component
function FragranceFacts() {
  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const facts = [
    "🌹 Ancient Egyptians used fragrances in religious ceremonies over 4,000 years ago!",
    "👃 The human nose can distinguish over 1 trillion different scents!",
    "⛪ Frankincense was once more valuable than gold in biblical times",
    "🧠 Scent is the only sense directly connected to memory and emotion",
    "🌿 It takes 2,000 rose petals to make just 1 gram of rose oil",
    "🎭 Cleopatra scented the sails of her ship to seduce Mark Antony",
    "🏠 Chicago's first perfumery opened in 1871, right after the Great Fire!"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % facts.length);
        setIsVisible(true);
      }, 500);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [facts.length]);
  
  return (
    <div className="bg-gradient-to-r from-champagne/10 to-luxury-black/10 p-6 rounded-lg text-center">
      <h4 className="text-lg font-serif font-semibold text-luxury-black mb-3">✨ Fun Fragrance Facts ✨</h4>
      <p className={`text-gray-700 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {facts[currentFact]}
      </p>
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

      {/* Biblical Foundation - Revelation 21:6 */}
      <section className="py-16 bg-gradient-to-r from-luxury-black to-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="text-champagne text-sm font-medium tracking-wider uppercase">
              Revelation 21:6 - Our Foundation
            </span>
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
            And he said unto me, It is done. I am Alpha and Omega, the beginning and the end. I will give unto him that is athirst of the fountain of the water of life freely.
          </blockquote>
          <cite className="text-champagne text-lg font-medium">
            — Revelation 21:6
          </cite>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            As the Alpha and Omega, He offers the water of life freely. Our fragrances embody this divine generosity — each scent crafted to refresh the spirit and awaken the soul to eternal beauty.
          </p>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="bg-warm-gray">
        <ProductGallery />
      </section>

      {/* Fun Facts Section */}
      <section className="py-16 bg-warm-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FragranceFacts />
        </div>
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
                  Limited to 100 blessed bottles monthly. Each one is a unique blessing that cannot be replicated. ✨
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

      {/* Creator Story Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-warm-gray to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Creator Image */}
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <img 
                  src={creatorImage} 
                  alt="Master Perfumer - RVLTN Parfums Creator" 
                  className="w-80 h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
            
            {/* Creator Story */}
            <div className="order-1 lg:order-2">
              <h3 className="text-4xl font-serif font-bold text-luxury-black mb-6">From the Southside to Sacred Scents</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Born and raised on Chicago's southside, my journey took me from the working-class neighborhoods of Bridgeport to Blue Island, and eventually into the world of luxury fragrances. Growing up where authenticity and hard work were everything, I discovered that true luxury comes from passion and purpose.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                What started as experimenting with essential oils in my southside apartment transformed into a divine calling. I blend Chicago work ethic with biblical tradition - each fragrance telling stories of scripture while carrying that authentic southside soul. From Bridgeport to luxury boutiques worldwide, these scents represent where faith meets ambition.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Like a sweet fragrance rising to heaven, may these scents be a blessing to all who wear them. - Psalm 141:2
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-home text-champagne mr-3"></i>
                  <span className="text-gray-700">From Bridgeport to Blue Island to luxury</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-cross text-champagne mr-3"></i>
                  <span className="text-gray-700">Biblical inspiration meets urban authenticity</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-heart text-champagne mr-3"></i>
                  <span className="text-gray-700">Chicago work ethic with divine purpose</span>
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