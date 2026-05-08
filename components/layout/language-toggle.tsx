'use client'

import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {language === 'pt' ? 'EN' : 'PT'}
    </Button>
  )
}
