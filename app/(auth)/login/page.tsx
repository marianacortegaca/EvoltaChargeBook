import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <AuthCard
      title="Bem-vindo de volta"
      description="Entre na sua conta para fazer reservas"
      footer={
        <>
          Não tem conta?{' '}
          <Link href="/signup" className="font-medium text-gold hover:text-gold-dark transition-colors">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
