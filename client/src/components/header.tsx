import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartCount = 0, onCartClick }: HeaderProps = {}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const navClass = "text-[10px] font-semibold uppercase tracking-[0.19em] text-[#f3ead8]/75 transition-colors hover:text-[#d4ad70] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4ad70]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d4ad70]/20 bg-[#11161c]/90 text-[#f3ead8] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Chicago Exclusif Parfums home">
          <span className="flex h-10 w-10 items-center justify-center border border-[#d4ad70]/70 text-[10px] font-semibold tracking-[0.18em] text-[#d4ad70] transition-transform group-hover:rotate-[-6deg]">CE</span>
          <span className="leading-none">
            <span className="block font-serif text-[17px] tracking-[0.04em] sm:text-[19px]">CHICAGO EXCLUSIF</span>
            <span className="mt-1 block font-mono text-[8px] tracking-[0.28em] text-[#d4ad70]">PARFUMS · CHICAGO, IL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link href="/shop" className={navClass}>Collections</Link>
          <button onClick={() => scrollToSection("about")} className={navClass}>Our House</button>
          <Link href="/policy" className={navClass}>Policies</Link>
          {onCartClick ? (
              <Button onClick={onCartClick} size="sm" aria-label={`Open cart, ${cartCount} items`} className="relative rounded-none bg-[#d4ad70] text-[#151a20] hover:bg-[#e3c28e]">
              <ShoppingBag className="mr-2 h-4 w-4" /> Bag
              {cartCount > 0 && <Badge className="absolute -right-2 -top-2 border-[#111310] bg-[#cf3e68] px-1.5 text-white">{cartCount}</Badge>}
            </Button>
          ) : (
            <Link href="/shop" className="relative inline-flex items-center gap-2 bg-[#d4ad70] px-4 py-2 text-sm font-semibold text-[#151a20] hover:bg-[#e3c28e]">
              <ShoppingBag className="h-4 w-4" /> Shop
              {cartCount > 0 && <Badge className="absolute -right-2 -top-2 border-[#111310] bg-[#cf3e68] px-1.5 text-white">{cartCount}</Badge>}
            </Link>
          )}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-[#d8b76a]/30 bg-transparent text-[#f3ead8] md:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="border-[#d4ad70]/20 bg-[#11161c] text-[#f3ead8]">
            <div className="mb-9 mt-8 border-b border-[#d8b76a]/20 pb-5">
              <p className="font-serif text-xl">Chicago Exclusif</p>
              <p className="mt-1 text-[10px] tracking-[0.3em] text-[#d8b76a]">PARFUMS</p>
            </div>
            <nav className="flex flex-col gap-6">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className={navClass}>Explore collections</Link>
              <button onClick={() => scrollToSection("about")} className={`${navClass} text-left`}>Our house</button>
              <Link href="/policy" onClick={() => setMobileMenuOpen(false)} className={navClass}>Policies</Link>
              {onCartClick && <button onClick={() => { setMobileMenuOpen(false); onCartClick(); }} className={`${navClass} text-left`}>Shopping bag ({cartCount})</button>}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}