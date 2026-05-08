'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utilizador',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = createClient()

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setState({
            user: mapSupabaseUser(session.user),
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({
          user: mapSupabaseUser(session.user),
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('[v0] Login attempt:', email)
    setState(prev => ({ ...prev, isLoading: true }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })
    
    console.log('[v0] Login result:', { data, error })
    
    if (error) {
      console.log('[v0] Login error:', error.message)
      setState(prev => ({ ...prev, isLoading: false }))
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Email ou password incorretos.' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Por favor confirme o seu email antes de fazer login.' }
      }
      return { success: false, error: error.message }
    }
    
    if (data.user) {
      console.log('[v0] Login success, user:', data.user.email)
      setState({
        user: mapSupabaseUser(data.user),
        isLoading: false,
        isAuthenticated: true,
      })
    }
    
    return { success: true }
  }, [supabase.auth])

  const signup = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    console.log('[v0] Signup attempt:', email, name)
    setState(prev => ({ ...prev, isLoading: true }))
    
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          name,
        },
      },
    })
    
    console.log('[v0] Signup result:', { user: data?.user?.email, session: !!data?.session, error })
    
    if (error) {
      console.log('[v0] Signup error:', error.message)
      setState(prev => ({ ...prev, isLoading: false }))
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Este email já está registado.' }
      }
      return { success: false, error: error.message }
    }
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      console.log('[v0] Email confirmation required')
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: true, error: 'Verifique o seu email para confirmar a conta.' }
    }
    
    if (data.user && data.session) {
      setState({
        user: mapSupabaseUser(data.user),
        isLoading: false,
        isAuthenticated: true,
      })
    }
    
    return { success: true }
  }, [supabase.auth])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    await supabase.auth.signOut()
    
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [supabase.auth])

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
        `${window.location.origin}/auth/callback`,
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  }, [supabase.auth])

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
