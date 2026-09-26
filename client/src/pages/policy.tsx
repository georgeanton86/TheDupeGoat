import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Policy() {
  return (
    <div className="min-h-screen bg-[#151a20] text-[#f3ead8]">
      <Header />
      
      <section className="bg-[#151a20] pb-20 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4ad70]">Chicago Exclusif Parfums · The house</p>
            <h1 className="mb-4 font-serif text-4xl font-bold text-[#f3ead8]">Terms & Conditions</h1>
            <p className="text-lg text-[#f3ead8]/65">Important information regarding your purchase</p>
          </div>
          
          <Card className="rounded-none border border-[#d4ad70]/30 border-l-4 border-l-[#d4ad70] bg-[#1c232a] text-[#f3ead8]">
            <CardContent className="p-8">
              <h2 className="mb-6 font-serif text-2xl font-bold text-[#d4ad70]">NO RETURN, NO REFUND POLICY</h2>
              
              <div className="space-y-6 text-[#f3ead8]/75 [&_h3]:text-[#f3ead8]">
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">OVERVIEW</h3>
                  <p className="leading-relaxed">
                    Due to health, safety, and hygiene regulations governing cosmetic and fragrance products, Chicago Exclusif Parfums, including its RVLTN collection, operates under a strict <strong>NO RETURN, NO REFUND</strong> policy for purchases.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">COVERAGE</h3>
                  <p className="leading-relaxed">
                    This policy applies to all:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Perfumes and fragrances</li>
                    <li>Cosmetics and makeup products</li>
                    <li>Skincare items</li>
                    <li>Personal care products</li>
                    <li>Gift sets and limited editions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">NO RETURNS ACCEPTED</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Opened Products</strong>: No returns accepted once protective seals are broken</li>
                    <li><strong>Unopened Products</strong>: No returns for change of mind, color/scent preference, or buyer's remorse</li>
                    <li><strong>Custom/Personalized Items</strong>: All engraved or personalized products are final sale</li>
                    <li><strong>Damaged Packaging</strong>: Items with damaged outer packaging cannot be returned</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">HYGIENE & SAFETY COMPLIANCE</h3>
                  <p className="leading-relaxed">
                    In accordance with FDA regulations and industry safety standards, we cannot accept returns of cosmetic products that may have come into contact with skin, hair, or other surfaces due to contamination risks.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">QUALITY ASSURANCE</h3>
                  <p className="leading-relaxed">
                    We stand behind our product quality. If you receive a defective, damaged, or materially different product than ordered, please contact us within 48 hours of delivery at info@rvltnparfums.com.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">EXCEPTIONS</h3>
                  <p className="leading-relaxed">
                    Returns will only be processed in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Product manufacturing defects</li>
                    <li>Shipping damage during transit</li>
                    <li>Incorrect item shipped by our error</li>
                    <li>Products past expiration date upon receipt</li>
                  </ul>
                  <p className="mt-2 text-sm">
                    <strong>Documentation Required</strong>: Original receipt, order confirmation, and photographic evidence of defect/damage.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">CUSTOMER RESPONSIBILITIES</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Examine all products immediately upon delivery</li>
                    <li>Report any issues within 48 hours of receipt</li>
                    <li>Retain original packaging and documentation</li>
                    <li>Review product descriptions, ingredients, and specifications before purchase</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">LEGAL COMPLIANCE</h3>
                  <p className="leading-relaxed">
                    This policy complies with applicable consumer protection laws. Where legally required, refunds for defective products will be honored regardless of this policy.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">POLICY MODIFICATIONS</h3>
                  <p className="leading-relaxed">
                    We reserve the right to modify this policy at any time. Updates will be posted on our website with the effective date. Continued use of our services constitutes acceptance of policy changes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-luxury-black mb-2 text-lg">CONTACT INFORMATION</h3>
                  <p className="leading-relaxed">
                    For questions regarding this policy or to report product defects:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>Email: info@rvltnparfums.com</li>
                  </ul>
                </div>
              </div>
              
               <div className="mt-8 border-t border-[#d4ad70]/20 pt-6">
                 <p className="text-xs text-[#f3ead8]/50">
                  <i className="fas fa-info-circle mr-1"></i>
                  <strong>Effective Date</strong>: December 1, 2024 | <strong>Last Updated</strong>: December 1, 2024
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
