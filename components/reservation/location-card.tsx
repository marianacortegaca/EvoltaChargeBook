'use client'

import { MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import type { Location } from '@/lib/types'

interface LocationCardProps {
  location: Location
  selected: boolean
  onSelect: () => void
}

export function LocationCard({ location, selected, onSelect }: LocationCardProps) {
  const { t } = useLanguage()
  const isDisabled = !location.available
  
  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      className={cn(
        'group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        selected && !isDisabled && 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(200,164,93,0.15)]',
        !selected && !isDisabled && 'border-border bg-background hover:border-gold/50 hover:bg-gold/[0.02]',
        isDisabled && 'cursor-not-allowed border-border bg-muted/50 opacity-70'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            selected ? 'bg-gold text-charcoal' : 'bg-gray-light text-charcoal',
            isDisabled && 'bg-muted text-muted-foreground'
          )}>
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs font-semibold uppercase tracking-wide',
                selected ? 'text-gold' : 'text-muted-foreground',
                isDisabled && 'text-muted-foreground'
              )}>
                {location.city}
              </span>
              <span className="text-muted-foreground">|</span>
              <h3 className={cn(
                'font-semibold text-foreground',
                isDisabled && 'text-muted-foreground'
              )}>
                {location.name}
              </h3>
            </div>
            {location.comingSoon && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t('comingSoon')}
              </p>
            )}
          </div>
        </div>
        
        <div className={cn(
          'rounded-full px-3 py-1 text-xs font-medium',
          isDisabled 
            ? 'bg-muted text-muted-foreground' 
            : selected
              ? 'bg-gold/20 text-gold-dark'
              : 'bg-green-100 text-green-700'
        )}>
          {isDisabled ? t('comingSoon') : t('available')}
        </div>
      </div>
      
      {/* Selection indicator */}
      {selected && !isDisabled && (
        <div className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-charcoal">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}
