import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black">
      <Header />
      
      <section className="pt-24 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-champagne mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-white/80">Everything you need to know about Chicago Exclusif Parfums and RVLTN</p>
          </div>
          
          <Card className="bg-white/5 backdrop-blur-sm border-champagne/20">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is The Seven Seals Collection?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    The Seven Seals Collection features 8 unique fragrances inspired by the Book of Revelation. Each scent is crafted to embody a specific biblical theme, from the Four Horsemen to the Seventh Seal, plus our signature Lux Aeterna (Eternal Light).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What does "Extrait de Parfum" mean?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Extrait de Parfum is the highest concentration of fragrance available, containing 20-40% pure perfume oil. This means longer-lasting scent, richer complexity, and exceptional quality compared to standard Eau de Parfum or Eau de Toilette.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    Are your fragrances unisex?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Yes! All 8 fragrances in The Seven Seals Collection are designed to be unisex. We believe scent transcends gender - choose what resonates with your spirit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is your small batch approach?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Every batch is handcrafted with meticulous attention - never more than 100 bottles. Like fine craft spirits, our small batches ensure exceptional quality and a personal touch in every bottle.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    Do you offer free shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Yes! Orders over $100 qualify for free shipping nationwide. Prices vary by size and concentration; see the shop for current options.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is your promo code?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Use code <strong className="text-champagne">WELCOME10</strong> at checkout for 10% off your first order!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is your return policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Due to health and safety regulations, we operate under a strict NO RETURN, NO REFUND policy. We only accept returns for defective products, shipping damage, or incorrect items shipped by our error. Please see our full <a href="/policy" className="text-champagne hover:underline">Terms & Conditions</a> page.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    How long does shipping take?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Standard shipping typically takes 5-7 business days. Each fragrance is carefully packaged with thoughtful presentation and handling. You'll receive tracking information once your order ships.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    How should I store my fragrance?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Store your fragrance in a cool, dry place away from direct sunlight and heat. Keep the bottle tightly sealed when not in use. Proper storage ensures your scent maintains its integrity and longevity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    How do I contact customer service?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    For questions, concerns, or support:
                    <ul className="mt-2 space-y-1">
                      <li>Email: info@rvltnparfums.com</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    Are all 8 fragrances available now?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    The eight RVLTN Seven Seals fragrances have purchase options in the shop. Player One, Play Again?, and Half Life are Chicago Exclusif bottle previews and are not yet for sale.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. All transactions are securely processed with industry-standard encryption.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-white/80">
              Still have questions? <a href="mailto:info@rvltnparfums.com" className="text-champagne hover:underline">Contact us directly</a>
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
