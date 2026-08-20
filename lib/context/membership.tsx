'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { MembershipStatus } from '@/lib/supabase/types'

interface MembershipContextType {
  status: MembershipStatus | null
  loading: boolean
  isClubhouseMember: boolean
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined)

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<MembershipStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembershipStatus()
  }, [])

  const fetchMembershipStatus = async () => {
    try {
      const response = await fetch('/api/auth/membership-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        // If endpoint fails, default to not a member
        setStatus({
          clubhouse: false,
          status: 'not_configured',
          renewalDate: null,
        })
        return
      }

      const data: MembershipStatus = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch membership status:', error)
      // Fail gracefully - default to non-member
      setStatus({
        clubhouse: false,
        status: 'not_configured',
        renewalDate: null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MembershipContext.Provider
      value={{
        status,
        loading,
        isClubhouseMember: status?.clubhouse ?? false,
      }}
    >
      {children}
    </MembershipContext.Provider>
  )
}

export function useMembership() {
  const context = useContext(MembershipContext)
  if (context === undefined) {
    throw new Error('useMembership must be used within MembershipProvider')
  }
  return context
}
