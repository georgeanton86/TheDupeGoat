import { Link, useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [location] = useLocation();
  const scrollTo = (id: string) => {
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <footer className="relative overflow-hidden border-t border-[#d4ad70]/25 bg-[#11161c] text-[#f3ead8]">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] bg-[url('/chicago/chicago-noir-skyline.jpg')] bg-cover bg-center opacity-[0.12] md:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl tracking-wide">Chicago Exclusif</p>
           <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-[#d4ad70]">PARFUMS · AN ORIGINAL CHICAGO HOUSE</p>
           <p className="mt-5 max-w-sm text-sm leading-6 text-[#f3ead8]/65">Night-lit originals from Chicago Exclusif, alongside the distinctly spiritual Seven Seals collection by RVLTN Parfums.</p>
          <a href="mailto:info@rvltnparfums.com" className="mt-5 inline-flex items-center gap-2 text-sm text-[#d8b76a] hover:text-[#f3ead8]">Contact the house <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b76a]">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#f3ead8]/70">
            <li><Link href="/" className="hover:text-[#d8b76a]">Home</Link></li>
            <li><Link href="/shop" className="hover:text-[#d8b76a]">All collections</Link></li>
            <li><button onClick={() => scrollTo("about")} className="hover:text-[#d8b76a]">Our house</button></li>
            <li><button onClick={() => scrollTo("faq")} className="hover:text-[#d8b76a]">Frequently asked questions</button></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b76a]">Customer care</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#f3ead8]/70">
            <li><Link href="/policy" className="hover:text-[#d8b76a]">Terms &amp; return policy</Link></li>
            <li><a href="mailto:info@rvltnparfums.com" className="hover:text-[#d8b76a]">Email support</a></li>
          </ul>
        </div>
      </div>
       <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-[#f3ead8]/45 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Chicago Exclusif Parfums. All rights reserved.</p>
          <p>Chicago, Illinois</p>
        </div>
      </div>
    </footer>
  );
}