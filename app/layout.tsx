import type { Metadata } from 'next'
import { MembershipProvider } from '@/lib/context/membership'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crema Clubhouse — Premium Coffee Gear at Member Prices',
  description:
    'Shop premium coffee gear at regular prices or unlock lower Clubhouse pricing across the store.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☕</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cream-50 text-slate-900 antialiased">
        <MembershipProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </MembershipProvider>
      </body>
    </html>
  )
}
