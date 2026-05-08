'use client'

import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { LoginForm } from '@/components/auth/login-form'
import { useLanguage } from '@/contexts/language-context'
import { LanguageToggle } from '@/components/layout/language-toggle'

export default function LoginPage() {
  const { t } = useLanguage()
  
  return (
    <>
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
      <AuthCard
        title={t('loginTitle') as string}
        description={t('loginDescription') as string}
        footer={
          <>
            {t('noAccount')}{' '}
            <Link href="/signup" className="font-medium text-gold hover:text-gold-dark transition-colors">
              {t('createAccount')}
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </>
  )
}
