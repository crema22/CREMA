'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useMembership } from '@/lib/context/membership'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { status } = useMembership()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max section-padding">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Account</h1>
          <p className="text-slate-700 mb-12">Manage your Crema Clubhouse membership.</p>

          <div className="bg-white rounded-lg border border-cream-900 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Details</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
              </div>

              <div className="border-t border-cream-900 pt-6">
                <label className="text-sm text-slate-600">Clubhouse Membership</label>
                {status?.clubhouse ? (
                  <div>
                    <p className="text-lg font-bold text-espresso mb-2">✓ Active Member</p>
                    <p className="text-sm text-slate-600">
                      {status.status === 'trialing' ? 'Trial in progress' : 'Membership active'}
                    </p>
                    {status.renewalDate && (
                      <p className="text-sm text-slate-600">
                        Next renewal: {new Date(status.renewalDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-slate-900 mb-2">Not a member</p>
                    <Link href="/shop" className="text-espresso font-medium hover:opacity-80">
                      Unlock Clubhouse pricing →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-cream-900 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/shop" className="btn-primary w-full text-center block">
                Browse products
              </Link>
              <Link href="/clubhouse" className="btn-secondary w-full text-center block">
                Membership details
              </Link>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-cream-900">
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-espresso font-medium transition"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
