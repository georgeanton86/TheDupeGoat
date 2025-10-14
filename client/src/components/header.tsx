import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <h1 className="text-2xl font-serif font-bold text-luxury-black tracking-wide">RVLTN</h1>
            <span className="ml-2 text-sm font-light text-gray-500 tracking-widest">PARFUMS</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/shop" 
              className="text-sm font-medium text-charcoal hover:text-champagne transition-colors"
              data-testid="link-shop"
            >
              Shop
            </Link>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-medium text-charcoal hover:text-champagne transition-colors"
              data-testid="button-nav-about"
            >
              About
            </button>
            <Link 
              href="/policy" 
              className="text-sm font-medium text-charcoal hover:text-champagne transition-colors"
              data-testid="link-policy"
            >
              Policy
            </Link>
          </nav>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <i className="fas fa-bars text-luxury-black"></i>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="/shop" 
                  className="text-sm font-medium text-charcoal hover:text-champagne transition-colors"
                >
                  Shop
                </Link>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-sm font-medium text-charcoal hover:text-champagne transition-colors text-left"
                >
                  About
                </button>
                <Link 
                  href="/policy" 
                  className="text-sm font-medium text-charcoal hover:text-champagne transition-colors"
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
