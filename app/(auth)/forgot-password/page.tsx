import { AuthCard } from '@/components/auth/auth-card'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar palavra-passe"
      description="Introduza o seu email para recuperar o acesso"
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
