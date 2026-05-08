'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, AuthState } from '@/lib/types'

// Mock user storage (replace with Supabase in production)
const STORAGE_KEY = 'evolta_auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database (replace with Supabase)
const mockUsers: Map<string, { user: User; password: string }> = new Map()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const user = JSON.parse(stored) as User
          setState({
            user,
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
    
    // Small delay to simulate async session check
    const timer = setTimeout(checkSession, 100)
    return () => clearTimeout(timer)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Check mock database - only allow registered users
    const userData = mockUsers.get(email.toLowerCase())
    
    if (!userData) {
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Email não registado. Por favor, crie uma conta.' }
    }
    
    if (userData.password !== password) {
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Password incorreta.' }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData.user))
    setState({
      user: userData.user,
      isLoading: false,
      isAuthenticated: true,
    })
    return { success: true }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Check if user already exists
    if (mockUsers.has(email.toLowerCase())) {
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Este email já está registado' }
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      createdAt: new Date().toISOString(),
    }
    
    mockUsers.set(email.toLowerCase(), { user: newUser, password })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    
    setState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    })
    
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    localStorage.removeItem(STORAGE_KEY)
    
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // In production, this would trigger Supabase password reset email
    // For demo, we just return success
    return { success: true }
  }, [])

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
