import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Registe-se para começar a fazer reservas"
      footer={
        <>
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-gold hover:text-gold-dark transition-colors">
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  )
}
