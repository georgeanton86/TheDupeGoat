import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import brandLogo from "@assets/file_00000000c5c4622f8f60554b7297e0f4_1760480858957.png";

export default function Header() {
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/95 backdrop-blur-sm border-b border-champagne/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            <img src={brandLogo} alt="RVLTN PARFUMS" className="h-14 w-14 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-serif font-bold text-champagne tracking-wide">RVLTN</h1>
              <span className="text-xs font-light text-champagne/70 tracking-widest">PARFUMS</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/shop" 
              className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="link-shop"
            >
              Collection
            </Link>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="button-nav-about"
            >
              Our Story
            </button>
            <Link 
              href="/policy" 
              className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="link-policy"
            >
              Policy
            </Link>
            <Link 
              href="/shop" 
              className="ml-4"
              data-testid="link-cart"
            >
              <Button size="sm" className="bg-champagne text-luxury-black hover:bg-champagne/90 font-semibold">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <i className="fas fa-bars text-champagne"></i>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-luxury-black border-champagne/20">
              <div className="flex items-center gap-3 mb-8">
                <img src={brandLogo} alt="RVLTN PARFUMS" className="h-12 w-12 object-contain" />
                <div className="flex flex-col">
                  <h2 className="text-xl font-serif font-bold text-champagne">RVLTN</h2>
                  <span className="text-xs font-light text-champagne/70 tracking-widest">PARFUMS</span>
                </div>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/shop" 
                  className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors uppercase tracking-wide"
                >
                  Collection
                </Link>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors text-left uppercase tracking-wide"
                >
                  Our Story
                </button>
                <Link 
                  href="/policy" 
                  className="text-sm font-semibold text-champagne/90 hover:text-champagne transition-colors uppercase tracking-wide"
                >
                  Policy
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
