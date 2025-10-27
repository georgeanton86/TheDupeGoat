import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductShowcase from "@/components/product-showcase";
import ProductGallery from "@/components/product-gallery";
import shieldLogo from "@assets/file_00000000bbe861f59a1f386791e71acf_1760480859007.png";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Award, Truck } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <span className="text-sm font-medium text-champagne">
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
      <h4 className="text-lg font-serif font-semibold text-champagne mb-3">✨ Fun Fragrance Facts ✨</h4>
      <p className={`text-white/80 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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
              <p className="text-white text-sm">8 fragrances inspired by Scripture</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg p-6 text-center">
              <Truck className="w-10 h-10 text-champagne mx-auto mb-3" />
              <h3 className="text-champagne font-semibold mb-2">Free Shipping Over $100</h3>
              <p className="text-white text-sm">Fast delivery nationwide</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg p-6 text-center">
              <Award className="w-10 h-10 text-champagne mx-auto mb-3" />
              <h3 className="text-champagne font-semibold mb-2">Premium Quality</h3>
              <p className="text-white text-sm">100mL Extrait de Parfum</p>
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
            <h3 className="text-3xl font-serif font-bold text-amber-600 mb-4">Our Promise</h3>
            <p className="text-lg text-amber-600/80 max-w-2xl mx-auto">
              Every fragrance tells a story. Ours speaks of inspiration, mystery, and timeless elegance.
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
                <h4 className="text-xl font-serif font-semibold mb-4 text-amber-600">Small Batch Excellence</h4>
                <p className="text-amber-600/80">
                  Every batch is handcrafted with meticulous attention - never more than 100 bottles. Like fine craft spirits, our small batches ensure exceptional quality and a personal touch in every bottle. ✨
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

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-serif font-bold text-champagne mb-8">Our Story</h3>
          
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            The Seven Seals Collection represents a unique intersection of faith and fragrance. Each of our eight biblical fragrances draws inspiration from the Book of Revelation, transforming sacred scripture into wearable art.
          </p>
          
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Every batch is handcrafted with meticulous attention - never more than 100 bottles. Like fine craft spirits, our small batches ensure exceptional quality and a personal touch in every bottle.
          </p>
          
          <p className="text-lg text-white/90 mb-8 leading-relaxed italic">
            "Like a sweet fragrance rising to heaven, may these scents be a blessing to all who wear them." - Psalm 141:2
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-flask text-2xl text-champagne"></i>
              </div>
              <h4 className="font-semibold text-champagne mb-2">Premium Quality</h4>
              <p className="text-white/80 text-sm">100mL Extrait de Parfum concentration</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cross text-2xl text-champagne"></i>
              </div>
              <h4 className="font-semibold text-champagne mb-2">Biblical Inspiration</h4>
              <p className="text-white/80 text-sm">Each scent rooted in Scripture</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-2xl text-champagne"></i>
              </div>
              <h4 className="font-semibold text-champagne mb-2">Crafted with Care</h4>
              <p className="text-white/80 text-sm">Limited small batch production</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-r from-luxury-black to-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-serif font-bold text-champagne mb-4">Frequently Asked Questions</h3>
            <p className="text-lg text-white/80">Everything you need to know about RVLTN Parfums</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                What is The Seven Seals Collection?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                The Seven Seals Collection features 8 unique fragrances inspired by the Book of Revelation. Each scent is crafted to embody a specific biblical theme, from the Four Horsemen to the Seventh Seal, plus our signature Lux Aeterna (Eternal Light).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                What does "Extrait de Parfum" mean?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Extrait de Parfum is the highest concentration of fragrance available, containing 20-40% pure perfume oil. This means longer-lasting scent, richer complexity, and exceptional quality compared to standard Eau de Parfum or Eau de Toilette.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                Are your fragrances unisex?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Yes! All 8 fragrances in The Seven Seals Collection are designed to be unisex. We believe scent transcends gender - choose what resonates with your spirit.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                What is your small batch approach?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Every batch is handcrafted with meticulous attention - never more than 100 bottles. Like fine craft spirits, our small batches ensure exceptional quality and a personal touch in every bottle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                Do you offer free shipping?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Yes! Orders over $100 qualify for free shipping nationwide. Since each bottle is $119, any single fragrance purchase includes complimentary delivery.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                What is your promo code?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Use code <strong className="text-champagne">WELCOME10</strong> at checkout for 10% off your first order!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                What is your return policy?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Due to health and safety regulations, we operate under a strict NO RETURN, NO REFUND policy. We only accept returns for defective products, shipping damage, or incorrect items shipped by our error. Please see our full <Link href="/policy" className="text-champagne hover:underline">Terms & Conditions</Link> page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                Are all 8 fragrances available now?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                Yes! All 8 fragrances in The Seven Seals Collection are available for immediate purchase. Due to our small batch production, availability is limited - each batch contains no more than 100 bottles.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white/5 backdrop-blur-sm border border-champagne/20 rounded-lg px-6">
              <AccordionTrigger className="text-left text-white hover:text-champagne py-4">
                How do I contact customer service?
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-4">
                For questions, concerns, or support:<br/>
                Email: info@rvltnparfums.com<br/>
                Phone: 1-800-RVLTN-99<br/>
                We respond within 24-48 hours
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
      <VisitorCounter />
    </div>
  );
}