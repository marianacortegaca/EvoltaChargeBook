'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { Loader2, CheckCircle } from 'lucide-react'

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signup, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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
      if (result.error) {
        // Email confirmation required
        setSuccess(result.error)
      } else {
        // Auto-login successful
        router.push('/dashboard')
      }
    } else {
      setError(result.error || t('errorGeneric') as string)
    }
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

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          <p>{success}</p>
        </div>
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
