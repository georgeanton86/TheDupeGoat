import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGallery from "@/components/product-gallery";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, ArrowUpRight, Gamepad2, Sparkles, MoonStar } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#151a20] text-[#f3ead8]">
      <Header />
      <main>
        <section className="noir-grain relative flex min-h-[760px] items-end overflow-hidden bg-[#11161c] pt-24 sm:min-h-[820px]">
          <div className="absolute inset-0">
            <img src="/chicago/chicago-noir-skyline.jpg" alt="Chicago skyline and river at night, seen through rain and city lights" className="h-full w-full object-cover object-[58%_center] opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#11161c] via-[#11161c]/80 to-[#11161c]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11161c] via-transparent to-[#11161c]/35" />
            <div className="absolute inset-0 bg-[#16212a]/25 mix-blend-color" />
          </div>
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-24 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:pb-24">
            <div className="max-w-2xl reveal-up">
              <p className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#d4ad70]"><span className="h-px w-9 bg-[#d4ad70]" /> THE DUPE GOAT · Chicago fragrance house</p>
              <h1 className="font-serif text-5xl leading-[0.91] tracking-[-0.045em] sm:text-7xl lg:text-[96px]">Scent for<br /><span className="text-[#d4ad70]">another</span><br />state of mind.</h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#f3ead8]/75 sm:text-lg">An independent fragrance house with an unapologetic point of view: designer scent inspirations, layered Dreamer hybrids, and Chicago Gaming hybrids.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-3 bg-[#d4ad70] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#151a20] transition-colors hover:bg-[#e3c28e]">Enter the shop <ArrowUpRight className="h-4 w-4" /></Link>
                <button onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-3 border border-white/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3ead8] transition-colors hover:border-[#d4ad70] hover:text-[#d4ad70]">Explore the house <ArrowDown className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-auto max-w-[350px] border-l border-[#d8b76a]/60 pl-6 pb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4ad70]">41° 52′ 55″ N · DREAMER / 01—03</p>
                <p className="mt-3 font-serif text-2xl">Three states. One collection.</p>
                <p className="mt-2 text-sm leading-6 text-[#f3ead8]/65">Lucid State, Fever Dream, Altered Mental Status. Dreamer transforms dupe inspirations into three original hybrid compositions.</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 right-6 hidden font-mono text-[9px] uppercase tracking-[0.24em] text-white/55 lg:block">The river remembers every light</div>
        </section>

        <section className="border-y border-[#d4ad70]/30 bg-[#d4ad70] text-[#151a20]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.17em]">TDG dupes &amp; hybrids · 5 / 10 / 20 / 30 mL</p>
            <p className="text-xs">Designer imagery shows scent inspiration only. THE DUPE GOAT is independent and unaffiliated.</p>
          </div>
        </section>

        <section id="collections" className="scroll-mt-20 bg-[#151a20]">
          <ProductGallery />
        </section>

        <section id="about" className="relative overflow-hidden border-y border-[#d4ad70]/20 bg-[#1c232a]">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#d8b76a]/10" />
          <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-[#d8b76a]/10" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:py-28">
            <div><p className="text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">One Chicago house, distinct voices</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">Dupe inspiration.<br />Original expression.</h2></div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#f3ead8]/80">THE DUPE GOAT makes Chicago its launchpad for fragrance with a twist: faithful scent directions, unexpected hybrids, and original concepts inspired by the city’s after-hours energy.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                <div className="border-t border-[#cf3e68]/50 pt-5"><Gamepad2 className="h-5 w-5 text-[#ed6689]" /><h3 className="mt-4 font-serif text-2xl">The Gaming Collection</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/60">Three original gaming-inspired compositions, sold as 30 mL decants. Pictured bottles are reference imagery; your fragrance arrives in a separate decant bottle.</p></div>
                <div className="border-t border-[#72e8ef]/50 pt-5"><MoonStar className="h-5 w-5 text-[#72e8ef]" /><h3 className="mt-4 font-serif text-2xl">Dupe / hybrid library</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/60">Twenty-five single-scent dupes and Dreamer’s three layered hybrids. Designer names and photos indicate inspiration only; TDG products are independent, not the originals.</p></div>
              </div>
              <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#d8b76a] hover:text-[#f3ead8]">Explore the collections <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
             <div><Sparkles className="h-6 w-6 text-[#d8b76a]" /><p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">The independent approach</p><h2 className="mt-3 font-serif text-4xl">Familiar notes.<br />New narratives.</h2></div>
             <div className="border-l border-[#d8b76a]/30 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-snug sm:text-3xl">“A scent can be a reference point—and still take you somewhere new.”</p><p className="mt-5 max-w-xl text-sm leading-7 text-[#f3ead8]/60">TDG fragrances are independently produced. We use designer fragrance names to identify scent inspiration, not affiliation. The bottle you receive is a THE DUPE GOAT decant, not the pictured designer product.</p></div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 bg-[#1c232a]">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">A few useful details</p>
            <h2 className="mt-3 text-center font-serif text-4xl">Questions, answered.</h2>
            <Accordion type="single" collapsible className="mt-10">
              <AccordionItem value="collections" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">What is THE DUPE GOAT?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">THE DUPE GOAT is an independent Chicago fragrance house with 25 single-scent dupes, the three-fragrance Dreamer hybrid series, and original Gaming scents. Referenced brand names are used only to identify inspiration; TDG is not affiliated with those brands.</AccordionContent></AccordionItem>
              <AccordionItem value="preview" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Can I buy Player One, Play Again? or Half Life?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Yes. Each is available as a 30 mL decant for $59.99, or get one of each for $150. Bottle photos are for reference; your fragrance ships in a different decant bottle.</AccordionContent></AccordionItem>
              <AccordionItem value="shipping" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">What is available in the shop?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Shop all 25 TDG dupes, all three Dreamer hybrids in 5, 10, 20, and 30 mL sizes, and the Gaming Collection in 30 mL decants. Availability and inventory are shown on each product.</AccordionContent></AccordionItem>
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