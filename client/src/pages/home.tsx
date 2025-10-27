import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductShowcase from "@/components/product-showcase";
import ProductGallery from "@/components/product-gallery";
import creatorImage from "@assets/Screenshot_20250822_065742_Photos_1755864649303.jpg";
import shieldLogo from "@assets/file_00000000bbe861f59a1f386791e71acf_1760480859007.png";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Award, Truck } from "lucide-react";
import { Link } from "wouter";
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
          {visitors} {isHovered ? 'here now' : 'viewing now'}
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
      <section id="featured" className="pt-20 min-h-screen bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0wLTRoLTJ2Mmgydi0yem0yIDJ2LTJoLTJ2MmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Prominent Revelation 21:6 Banner */}
        <div className="relative pt-8 pb-6">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-champagne/10 backdrop-blur-sm border-2 border-champagne rounded-lg py-4 px-6 inline-block">
              <p className="text-white text-sm font-medium mb-1">Our Foundation</p>
              <h2 className="text-champagne text-4xl md:text-5xl font-serif font-bold tracking-wide">
                REVELATION 21:6
              </h2>
              <p className="text-white text-sm mt-2 italic">"I am Alpha and Omega, the beginning and the end"</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <ProductShowcase />
        </div>
        
        {/* Trust Badges */}
        <div className="relative max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg p-6 text-center">
              <Shield className="w-10 h-10 text-champagne mx-auto mb-3" />
              <h3 className="text-champagne font-semibold mb-2">Authentic Biblical Scents</h3>
              <p className="text-champagne/70 text-sm">8 fragrances inspired by Scripture</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg p-6 text-center">
              <Truck className="w-10 h-10 text-champagne mx-auto mb-3" />
              <h3 className="text-champagne font-semibold mb-2">Free Shipping Over $100</h3>
              <p className="text-champagne/70 text-sm">Fast delivery nationwide</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg p-6 text-center">
              <Award className="w-10 h-10 text-champagne mx-auto mb-3" />
              <h3 className="text-champagne font-semibold mb-2">Premium Quality</h3>
              <p className="text-champagne/70 text-sm">100mL Extrait de Parfum</p>
            </div>
          </div>
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
      <section className="bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
        <ProductGallery />
      </section>

      {/* Fun Facts Section */}
      <section className="py-16 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FragranceFacts />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-serif font-bold text-amber-600 mb-4">The RVLTN Standard</h3>
            <p className="text-lg text-amber-600/80 max-w-2xl mx-auto">
              Every fragrance tells a story. Ours speaks of transformation, mystery, and the art of presence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-certificate text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4 text-amber-600">Masterfully Crafted</h4>
                <p className="text-amber-600/80">
                  Hand-blended with precision and care using premium ingredients sourced from ancient traditions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4 text-amber-600">Rare & Limited</h4>
                <p className="text-amber-600/80">
                  Limited to 100 bottles per fragrance. Each one crafted with intention and designed to endure. ✨
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-shipping-fast text-2xl text-champagne"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold mb-4 text-amber-600">Premium Delivery</h4>
                <p className="text-amber-600/80">
                  Thoughtful packaging and careful handling for each precious fragrance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Creator Story Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
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
              <h3 className="text-4xl font-serif font-bold text-amber-600 mb-6">From the Southside to Luxury</h3>
              <p className="text-lg text-amber-600/80 mb-6 leading-relaxed">
                Born and raised on Chicago's southside, my journey took me from the working-class neighborhoods of Bridgeport to Blue Island, and eventually into the world of luxury fragrances. Growing up where authenticity and hard work were everything, I discovered that true luxury comes from passion and purpose.
              </p>
              <p className="text-lg text-amber-600/80 mb-6 leading-relaxed">
                What started as experimenting with essential oils in my southside apartment became something bigger. I blend Chicago work ethic with ancient inspiration - each fragrance telling timeless stories while carrying that authentic southside soul. From Bridgeport to luxury boutiques worldwide, these scents represent where heritage meets ambition.
              </p>
              <p className="text-lg text-amber-600/80 mb-8 leading-relaxed">
                Each bottle is crafted to leave a lasting impression - powerful, intentional, unforgettable.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-home text-champagne mr-3"></i>
                  <span className="text-amber-600/80">From Bridgeport to Blue Island to luxury</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-book text-champagne mr-3"></i>
                  <span className="text-amber-600/80">Ancient inspiration meets urban authenticity</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-heart text-champagne mr-3"></i>
                  <span className="text-amber-600/80">Chicago work ethic with timeless purpose</span>
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