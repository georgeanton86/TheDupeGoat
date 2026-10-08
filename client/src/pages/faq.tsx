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
            <p className="text-lg text-white/80">THE DUPE GOAT · Chicago fragrance house</p>
          </div>
          
          <Card className="bg-white/5 backdrop-blur-sm border-champagne/20">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is THE DUPE GOAT?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    THE DUPE GOAT is an independent Chicago fragrance house offering 25 single-scent dupes, three Dreamer hybrid fragrances, and original Gaming scents.
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
                    TDG scents are offered without gender labels. Choose the fragrance that appeals to you.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What is your small batch approach?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    We focus on carefully composed fragrance and clear inspiration references. Current inventory appears on each product in the shop.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    Do you offer free shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Standard shipping is $8.99. Merchandise subtotals strictly over $50 qualify for free shipping, before promotions.
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
                    Our purchases are generally final sale, with exceptions for defective products, shipping damage, or incorrect items shipped by our error. Please see our full <a href="/policy" className="text-champagne hover:underline">Terms & Conditions</a> page.
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
                    This storefront does not publish a support email or social handle. Please refer to seller-provided order documentation for any support contact details.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">
                    What can I buy right now?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    The shop includes 25 TDG single-scent dupes and all three Dreamer hybrids in 5, 10, 15, 20, and 30 mL sizes. Larger sizes have a lower price per mL. Gaming scents are available as 30 mL decants; smaller sizes are not offered for Gaming.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13" className="border-champagne/20">
                  <AccordionTrigger className="text-left text-white hover:text-champagne">Are TDG products the original designer perfumes?</AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    No. Designer bottle photographs and brand/fragrance names refer to scent inspiration only. You receive an independently produced THE DUPE GOAT dupe or hybrid decant in the size selected—not an original designer perfume or its packaging. THE DUPE GOAT is not affiliated with, endorsed by, or sponsored by the referenced brands.
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
              Still have questions? Check the contact details supplied with your order.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
