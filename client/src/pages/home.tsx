import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGallery from "@/components/product-gallery";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, ArrowUpRight, Gamepad2, Landmark, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#171a16] text-[#f3ead8]">
      <Header />
      <main>
        <section className="relative flex min-h-[760px] items-end overflow-hidden bg-[#111310] pt-24 sm:min-h-[820px]">
          <div className="absolute inset-0">
            <img src="/chicago/collection.jpg" alt="Three Chicago Exclusif gaming fragrance bottles" className="h-full w-full object-cover object-center opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111310] via-[#111310]/85 to-[#111310]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111310] via-transparent to-[#111310]/25" />
          </div>
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-24 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:pb-24">
            <div className="max-w-2xl animate-[fade-in_.7s_ease-out_both]">
              <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e1c57e]"><span className="h-px w-9 bg-[#d8b76a]" /> An original Chicago fragrance house</p>
              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-[88px]">Chicago<br /><span className="text-[#d8b76a]">Exclusif</span><br />Parfums.</h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#f3ead8]/75 sm:text-lg">A house of contrasting worlds. Playful, pixel-bright Chicago originals and the contemplative spirit of RVLTN’s Seven Seals.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-3 bg-[#d8b76a] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#151713] transition-colors hover:bg-[#e7cc8e]">Explore both collections <ArrowUpRight className="h-4 w-4" /></Link>
                <button onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-3 border border-white/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3ead8] transition-colors hover:border-[#d8b76a] hover:text-[#d8b76a]">Discover the house <ArrowDown className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-auto max-w-[350px] border-l border-[#d8b76a]/60 pl-6 pb-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b76a]">Chicago originals · 01 / 03</p>
                <p className="mt-3 font-serif text-2xl">A new kind of game.</p>
                <p className="mt-2 text-sm leading-6 text-[#f3ead8]/65">Meet Player One, Play Again? and Half Life — real bottle previews from our gaming-inspired collection.</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 right-6 hidden text-[9px] uppercase tracking-[0.24em] text-white/45 lg:block">Made in the spirit of Chicago</div>
        </section>

        <section className="border-y border-[#d8b76a]/15 bg-[#d8b76a] text-[#171a16]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.17em]">Three gaming collection bottle previews</p>
            <p className="text-xs">Shown for collection discovery only. Not currently offered for sale.</p>
          </div>
        </section>

        <section id="collections" className="scroll-mt-20 bg-[#171a16]">
          <ProductGallery />
        </section>

        <section id="about" className="relative overflow-hidden border-y border-[#d8b76a]/20 bg-[#20241f]">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#d8b76a]/10" />
          <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-[#d8b76a]/10" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:py-28">
            <div><p className="text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">One house, distinct voices</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">An independent house with room for contrast.</h2></div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#f3ead8]/80">Chicago Exclusif Parfums is the parent house. Its point of view is broad by design: fragrance can be playful and unexpected, or richly symbolic and spiritual.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                <div className="border-t border-[#cf3e68]/50 pt-5"><Gamepad2 className="h-5 w-5 text-[#ed6689]" /><h3 className="mt-4 font-serif text-2xl">Chicago originals</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/60">The gaming collection brings arcade color and a knowing sense of play to the fragrance shelf. Current bottle photos are previews, not purchase listings.</p></div>
                <div className="border-t border-[#d8b76a]/50 pt-5"><Landmark className="h-5 w-5 text-[#d8b76a]" /><h3 className="mt-4 font-serif text-2xl">RVLTN Parfums</h3><p className="mt-2 text-sm leading-6 text-[#f3ead8]/60">A distinct collection within the house: The Seven Seals, a spiritual fragrance series inspired by Revelation, with its own identity and purchasable offerings.</p></div>
              </div>
              <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#d8b76a] hover:text-[#f3ead8]">Shop Seven Seals and explore previews <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
            <div><Sparkles className="h-6 w-6 text-[#d8b76a]" /><p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">A house in progress</p><h2 className="mt-3 font-serif text-4xl">New notes.<br />New narratives.</h2></div>
            <div className="border-l border-[#d8b76a]/30 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-snug sm:text-3xl">“Fragrance is a way to make a moment unmistakably yours.”</p><p className="mt-5 max-w-xl text-sm leading-7 text-[#f3ead8]/60">From an expressive new Chicago idea to a fragrance with spiritual roots, each collection is allowed to speak in its own voice. The connection is a belief in scent as personal expression.</p></div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 bg-[#20241f]">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#d8b76a]">A few useful details</p>
            <h2 className="mt-3 text-center font-serif text-4xl">Questions, answered.</h2>
            <Accordion type="single" collapsible className="mt-10">
              <AccordionItem value="collections" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">What is Chicago Exclusif Parfums?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Chicago Exclusif Parfums is the parent fragrance house. RVLTN Parfums remains a distinct collection under the house, alongside the Chicago gaming-inspired originals.</AccordionContent></AccordionItem>
              <AccordionItem value="preview" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Can I buy Player One, Play Again? or Half Life?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Not at this time. Their actual bottle photos are shown as collection previews only; they are not available to purchase and have no listed price, variants, or availability.</AccordionContent></AccordionItem>
              <AccordionItem value="seven-seals" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Are RVLTN and the gaming collection the same line?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">No. RVLTN’s Seven Seals is a distinct spiritual fragrance collection. The gaming fragrances are Chicago Exclusif originals and are not presented as biblical or part of Seven Seals.</AccordionContent></AccordionItem>
              <AccordionItem value="shipping" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">Where can I find current purchase details?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Visit the shop to see currently purchasable RVLTN products, available variants, and current pricing. The Chicago originals are clearly marked as previews.</AccordionContent></AccordionItem>
              <AccordionItem value="support" className="border-[#f3ead8]/15"><AccordionTrigger className="text-left text-[#f3ead8] hover:text-[#d8b76a]">How do I get in touch?</AccordionTrigger><AccordionContent className="leading-6 text-[#f3ead8]/65">Email info@rvltnparfums.com and the team will be glad to help.</AccordionContent></AccordionItem>
            </Accordion>
            <div className="mt-10 text-center"><Link href="/shop" className="inline-flex items-center gap-2 border border-[#d8b76a]/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8b76a] transition-colors hover:bg-[#d8b76a] hover:text-[#171a16]">Browse the shop <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}