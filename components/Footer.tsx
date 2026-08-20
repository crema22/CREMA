import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold mb-4">Crema Clubhouse</h3>
            <p className="text-sm text-slate-300">Premium coffee gear at member prices.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/shop" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/clubhouse" className="hover:text-white transition">Clubhouse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-sm text-slate-400">
          <p>&copy; 2024 Crema Clubhouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
