import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGallery, { DupeSpotlight } from "@/components/product-gallery";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, ArrowUpRight, Gamepad2, Sparkles, MoonStar } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="store-night min-h-[100dvh] text-[#f3ead8]">
      <Header />
      <main>
        <section className="store-hero noir-grain relative flex min-h-[760px] items-end overflow-hidden pt-24 sm:min-h-[820px]">
          <div className="absolute inset-0">
            <img src="/chicago/chicago-noir-skyline.jpg" alt="Chicago skyline and river at night, seen through rain and city lights" className="h-full w-full object-cover object-[58%_center] opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#18212a] via-[#18212a]/70 to-[#18212a]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18212a] via-transparent to-[#18212a]/25" />
            <div className="absolute inset-0 bg-[#16212a]/25 mix-blend-color" />
          </div>
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-24 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:pb-24">
            <div className="max-w-2xl reveal-up">
              <p className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#d4ad70]"><span className="h-px w-9 bg-[#d4ad70]" /> THE DUPE GOAT · Chicago fragrance house</p>
                <h1 className="font-serif text-5xl leading-[0.94] tracking-[-0.045em] sm:text-7xl lg:text-[82px]">Because you can&apos;t<br /><span className="text-[#d4ad70]">wear the bottle.</span></h1>
               <p className="mt-7 max-w-lg text-base leading-7 text-[#f3ead8]/75 sm:text-lg">Find familiar scent inspirations in 25 affordable, single-scent TDG dupes. Independent fragrances in your choice of decant size—not authentic designer perfume.</p>
               <p className="mt-4 font-mono text-xs tracking-wide text-[#d4ad70]">5 / 10 / 15 / 20 / 30 mL decants · better value in larger sizes</p>
              <div className="mt-9 flex flex-wrap gap-3">
                 <Link href="/shop#dupes" className="inline-flex items-center gap-3 bg-[#d4ad70] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#151a20] transition-colors hover:bg-[#e3c28e]">Shop designer-inspired dupes <ArrowUpRight className="h-4 w-4" /></Link>
                 <button onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-3 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3ead8]/75 hover:text-[#d4ad70]">Find your inspiration <ArrowDown className="h-4 w-4" /></button>
              </div>
            </div>
             <div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4ad70]">Recognize the inspiration. Shop the TDG dupe.</p><DupeSpotlight /></div>
          </div>
          <div className="absolute bottom-5 right-6 hidden font-mono text-[9px] uppercase tracking-[0.24em] text-white/55 lg:block">The river remembers every light</div>
        </section>

        <section className="border-y border-[#d4ad70]/30 bg-[#d4ad70] text-[#151a20]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
             <p className="text-xs font-semibold uppercase tracking-[0.17em]">25 single-scent dupes · Selected-size decants</p>
             <p className="max-w-xl text-xs leading-5">Designer bottles show inspiration only, not shipped packaging. THE DUPE GOAT is independent and unaffiliated.</p>
          </div>
        </section>

        <section id="collections" className="store-night scroll-mt-20">
          <ProductGallery />
        </section>

        <section id="about" className="store-panel relative overflow-hidden border-y border-[#d4ad70]/20">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#d8b76a]/10" />
          <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-[#d8b76a]/10" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:py-28">
            <div><p className="text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">One Chicago house, distinct voices</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">Dupe inspiration.<br />Original expression.</h2></div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#f3ead8]/80">THE DUPE GOAT makes Chicago its launchpad for fragrance with a twist: faithful scent directions, unexpected hybrids, and original concepts inspired by the city’s after-hours energy.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                 <div className="border-t border-[#d4ad70]/50 pt-5"><Sparkles className="h-5 w-5 text-[#d4ad70]" /><h3 className="mt-4 font-serif text-2xl">The single-scent library</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/75">Twenty-five designer-inspired TDG dupes in 5, 10, 15, 20 and 30 mL decants, with a lower price per mL at larger sizes. Find a recognizable scent direction without buying the original designer perfume.</p><Link href="/shop#dupes" className="mt-4 inline-flex items-center gap-2 text-xs text-[#d4ad70]">Shop the dupe library <ArrowUpRight className="h-4 w-4" /></Link></div>
                 <div className="border-t border-[#72e8ef]/50 pt-5"><div className="flex gap-3"><MoonStar className="h-5 w-5 text-[#72e8ef]" /><Gamepad2 className="h-5 w-5 text-[#ed6689]" /></div><h3 className="mt-4 font-serif text-2xl">The house hybrids</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/75">For another direction, discover the owner-created Dreamer and Gaming collections. Layered dupe inspirations, separate decant packaging, and a character of their own.</p><div className="mt-4 flex gap-5 text-xs"><Link href="/shop#dreamer" className="text-[#72e8ef]">Explore Dreamer</Link><Link href="/shop#gaming" className="text-[#ed6689]">Explore Gaming</Link></div></div>
              </div>
              <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#d8b76a] hover:text-[#f3ead8]">Explore the collections <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
             <div><Sparkles className="h-6 w-6 text-[#d8b76a]" /><p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">The independent approach</p><h2 className="mt-3 font-serif text-4xl">Familiar notes.<br />New narratives.</h2></div>
             <div className="border-l border-[#d8b76a]/30 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-snug sm:text-3xl">“A scent can be a reference point—and still take you somewhere new.”</p><p className="mt-5 max-w-xl text-sm leading-7 text-[#f3ead8]/75">TDG fragrances are independently produced. We use designer fragrance names to identify scent inspiration, not affiliation. The bottle you receive is a THE DUPE GOAT decant, not the pictured designer product.</p></div>
          </div>
        </section>

        <section id="faq" className="store-panel scroll-mt-20">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">A few useful details</p>
            <h2 className="mt-3 text-center font-serif text-4xl">Questions, answered.</h2>
            <Accordion type="single" collapsible className="mt-10">
              <AccordionItem value="collections" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">What is THE DUPE GOAT?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">THE DUPE GOAT is an independent Chicago fragrance house with 25 single-scent dupes, the three-fragrance Dreamer hybrid series, and original Gaming scents. Referenced brand names are used only to identify inspiration; TDG is not affiliated with those brands.</AccordionContent></AccordionItem>
              <AccordionItem value="preview" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Can I buy Player One, Play Again? or Half Life?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Yes. Each is available as a 30 mL decant for $59.99, or get one of each for $150. Bottle photos are for reference; your fragrance ships in a different decant bottle.</AccordionContent></AccordionItem>
              <AccordionItem value="shipping" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">What is available in the shop?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Shop all 25 TDG dupes and all three Dreamer hybrids in 5, 10, 15, 20, and 30 mL sizes, with a lower price per mL on larger sizes. Gaming scents are available as 30 mL decants. Availability and inventory are shown on each product.</AccordionContent></AccordionItem>
              <AccordionItem value="shipping-cost" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">When is shipping free?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Standard shipping is $8.99. Merchandise subtotals strictly over $50 qualify for free shipping, before promotions.</AccordionContent></AccordionItem>
              <AccordionItem value="inspiration" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Are the pictured designer bottles what I receive?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">No. For TDG single-scent dupes and Dreamer hybrids, designer bottles identify scent inspiration only. Your order is a TDG dupe or hybrid decant in the selected size, not the pictured original perfume. THE DUPE GOAT is independent and not affiliated with referenced fragrance brands.</AccordionContent></AccordionItem>
              <AccordionItem value="support" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">How do I get in touch?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">For purchase questions, use the contact information included with your order.</AccordionContent></AccordionItem>
            </Accordion>
            <div className="mt-10 text-center"><Link href="/shop" className="inline-flex items-center gap-2 border border-[#d8b76a]/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8b76a] transition-colors hover:bg-[#d8b76a] hover:text-[#171a16]">Browse the shop <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}