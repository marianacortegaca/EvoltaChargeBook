'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Por favor introduza o seu email')
      return
    }

    setIsSubmitting(true)
    const result = await resetPassword(email)
    setIsSubmitting(false)
    
    if (result.success) {
      setIsSuccess(true)
    } else {
      setError(result.error || 'Erro ao enviar email')
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Email enviado</h3>
          <p className="text-sm text-muted-foreground">
            Enviámos um email para <span className="font-medium text-foreground">{email}</span> com instruções para recuperar a sua palavra-passe.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="mt-4 w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="o.seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          Enviaremos um link para recuperar a sua palavra-passe.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button 
        type="submit" 
        className="w-full bg-charcoal text-white hover:bg-charcoal/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A enviar...
          </>
        ) : (
          'Enviar email'
        )}
      </Button>

      <Link href="/login" className="block">
        <Button variant="ghost" className="w-full text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao login
        </Button>
      </Link>
    </form>
  )
}
