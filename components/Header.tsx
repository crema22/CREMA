'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })
    return () => subscription?.unsubscribe()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-cream-900">
      <div className="container-max">
        <div className="flex justify-between items-center py-4">
          <Link 
            href="/" 
            className="font-bold text-lg tracking-tight text-slate-900 hover:text-espresso transition"
          >
            CREMA CLUBHOUSE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium text-slate-900 hover:text-espresso transition">
              Shop
            </Link>
            <Link href="/clubhouse" className="text-sm font-medium text-slate-900 hover:text-espresso transition">
              How It Works
            </Link>
            <Link href="/faq" className="text-sm font-medium text-slate-900 hover:text-espresso transition">
              FAQ
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/account" className="text-sm font-medium text-slate-900 hover:text-espresso transition">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-700 hover:text-espresso transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-slate-900 hover:text-espresso transition">
                Log In
              </Link>
            )}
            <Link href="/shop" className="btn-primary text-sm">
              Shop Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-cream-100 rounded transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-4 border-t border-cream-900 pt-4">
            <Link href="/shop" className="block text-sm font-medium text-slate-900 hover:text-espresso">
              Shop
            </Link>
            <Link href="/clubhouse" className="block text-sm font-medium text-slate-900 hover:text-espresso">
              How It Works
            </Link>
            <Link href="/faq" className="block text-sm font-medium text-slate-900 hover:text-espresso">
              FAQ
            </Link>
            {user ? (
              <>
                <Link href="/account" className="block text-sm font-medium text-slate-900 hover:text-espresso">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-sm font-medium text-slate-700 hover:text-espresso w-full text-left"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block text-sm font-medium text-slate-900 hover:text-espresso">
                Log In
              </Link>
            )}
            <Link href="/shop" className="btn-primary text-sm block text-center">
              Shop Now
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
