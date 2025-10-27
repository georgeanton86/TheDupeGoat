import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h4 className="text-2xl font-serif font-bold mb-4">RVLTN PARFUMS</h4>
            <p className="text-gray-300 leading-relaxed mb-6">
              Revolutionizing luxury fragrance through artisan craftsmanship and uncompromising exclusivity.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-champagne transition-colors"
                data-testid="link-instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-champagne transition-colors"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-champagne transition-colors"
                data-testid="link-facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-champagne transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-champagne transition-colors">Our Story</Link></li>
              <li><Link href="/shop" className="hover:text-champagne transition-colors">Shop</Link></li>
              <li><a href="mailto:info@rvltnparfums.com" className="hover:text-champagne transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/faq" className="hover:text-champagne transition-colors">FAQ</Link></li>
              <li><Link href="/policy" className="hover:text-champagne transition-colors">Return Policy</Link></li>
              <li><a href="mailto:info@rvltnparfums.com" className="hover:text-champagne transition-colors">Contact Us</a></li>
              <li><Link href="/shop" className="hover:text-champagne transition-colors">Shop Collection</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 RVLTN Parfums. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/policy" className="text-gray-400 hover:text-champagne text-sm transition-colors">Terms & Conditions</Link>
            <Link href="/faq" className="text-gray-400 hover:text-champagne text-sm transition-colors">FAQ</Link>
            <a href="mailto:info@rvltnparfums.com" className="text-gray-400 hover:text-champagne text-sm transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
