'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { translations, type Language, type TranslationKey } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string | string[]
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'evolta-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'pt') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'pt' ? 'en' : 'pt'
    setLanguage(newLang)
  }, [language, setLanguage])

  const t = useCallback((key: TranslationKey): string | string[] => {
    return translations[language][key]
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
