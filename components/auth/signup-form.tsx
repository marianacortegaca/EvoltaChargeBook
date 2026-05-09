'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const { signup, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError(t('fillAllFields') as string)
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch') as string)
      return
    }

    const result = await signup(email, password, name)
    
    if (result.success) {
      if (result.needsEmailConfirmation) {
        // Email confirmation required - show confirmation screen
        setShowEmailConfirmation(true)
      } else {
        // Auto-login successful (email confirmation disabled in Supabase)
        router.push('/dashboard')
      }
    } else {
      setError(result.error || t('errorGeneric') as string)
    }
  }

  // Show email confirmation screen
  if (showEmailConfirmation) {
    return (
      <div className="space-y-6 text-center">
        {/* Email Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
          <Mail className="h-10 w-10 text-gold" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {t('verifyEmailTitle')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('verifyEmailDescription')}
          </p>
        </div>

        {/* Email Display */}
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">{t('emailSentTo')}</p>
          <p className="font-medium text-foreground">{email}</p>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-border bg-background p-4 text-left">
          <p className="text-sm text-muted-foreground">
            {t('verifyEmailInstructions')}
          </p>
        </div>

        {/* Back to Login Link */}
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t('yourName') as string}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder="o.seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button 
        type="submit" 
        className="w-full bg-charcoal text-white hover:bg-charcoal/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('creatingAccount')}
          </>
        ) : (
          t('createAccount')
        )}
      </Button>
    </form>
  )
}
