import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-accent-blue" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <path d="M16 12v-6M16 26v-6M12 16H6M26 16h-6" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="text-lg font-bold text-white">InnovaSci AI Labs</span>
            </div>
            <p className="text-sm text-gray-400">
              Pioneering the future of artificial intelligence through rigorous research and innovation.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Research</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/research" className="hover:text-white">Research Hub</Link></li>
              <li><Link href="/publications" className="hover:text-white">Publications</Link></li>
              <li><Link href="/datasets" className="hover:text-white">Datasets</Link></li>
              <li><Link href="/models" className="hover:text-white">Models</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/news" className="hover:text-white">News</Link></li>
              <li><Link href="/events" className="hover:text-white">Events</Link></li>
              <li><Link href="/innovations" className="hover:text-white">Innovations</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/products/innovasci-nova" className="hover:text-white">Nova Platform</Link></li>
              <li><Link href="/products/genesis" className="hover:text-white">Genesis Suite</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border-subtle">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} InnovaSci AI Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}