'use client'

import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { SignupForm } from '@/components/auth/signup-form'
import { useLanguage } from '@/contexts/language-context'
import { LanguageToggle } from '@/components/layout/language-toggle'

export default function SignupPage() {
  const { t } = useLanguage()
  
  return (
    <>
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
      <AuthCard
        title={t('signupTitle') as string}
        description={t('signupDescription') as string}
        footer={
          <>
            {t('hasAccount')}{' '}
            <Link href="/login" className="font-medium text-gold hover:text-gold-dark transition-colors">
              {t('login')}
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthCard>
    </>
  )
}
