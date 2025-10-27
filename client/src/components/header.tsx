import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import brandLogo from "@assets/file_00000000c5c4622f8f60554b7297e0f4_1760480858957.png";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartCount = 0, onCartClick }: HeaderProps = {}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
              className="text-sm font-semibold text-white hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="link-shop"
            >
              Collection
            </Link>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-semibold text-white hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="button-nav-about"
            >
              Our Story
            </button>
            <Link 
              href="/policy" 
              className="text-sm font-semibold text-white hover:text-champagne transition-colors uppercase tracking-wide"
              data-testid="link-policy"
            >
              Policy
            </Link>
            {onCartClick ? (
              <Button 
                size="sm" 
                className="ml-4 bg-champagne text-luxury-black hover:bg-champagne/90 font-semibold relative"
                onClick={onCartClick}
                data-testid="button-cart-header"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white border-2 border-luxury-black px-1.5 min-w-[20px] h-5">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            ) : (
              <Link href="/shop" data-testid="link-cart">
                <Button size="sm" className="ml-4 bg-champagne text-luxury-black hover:bg-champagne/90 font-semibold relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white border-2 border-luxury-black px-1.5 min-w-[20px] h-5">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                  onClick={closeMobileMenu}
                  className="text-sm font-semibold text-white hover:text-champagne transition-colors uppercase tracking-wide"
                >
                  Collection
                </Link>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-sm font-semibold text-white hover:text-champagne transition-colors text-left uppercase tracking-wide"
                >
                  Our Story
                </button>
                <Link 
                  href="/policy"
                  onClick={closeMobileMenu}
                  className="text-sm font-semibold text-white hover:text-champagne transition-colors uppercase tracking-wide"
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
