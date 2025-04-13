"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ user: User | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => { return { user: null } },
  signOut: async () => {},
  signInWithGoogle: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    }
    
    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      
      if (event === 'SIGNED_IN') {
        router.refresh()
      }
      
      if (event === 'SIGNED_OUT') {
        router.refresh()
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    const { error, data } = await supabase.auth.signUp({
      email, 
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return { user: data.user }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}