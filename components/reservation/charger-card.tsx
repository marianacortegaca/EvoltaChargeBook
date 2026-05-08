'use client'

import { Zap, BatteryCharging } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import type { Charger } from '@/lib/types'

interface ChargerCardProps {
  charger: Charger
  selected: boolean
  onSelect: () => void
}

export function ChargerCard({ charger, selected, onSelect }: ChargerCardProps) {
  const { t } = useLanguage()
  const isFull = charger.availableSlots === 0
  
  return (
    <button
      onClick={onSelect}
      disabled={isFull}
      className={cn(
        'group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        selected && !isFull && 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(200,164,93,0.15)]',
        !selected && !isFull && 'border-border bg-background hover:border-gold/50 hover:bg-gold/[0.02]',
        isFull && 'cursor-not-allowed border-border bg-muted opacity-60'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            selected ? 'bg-gold text-charcoal' : 'bg-gray-light text-charcoal',
            isFull && 'bg-muted text-muted-foreground'
          )}>
            {charger.type === 'ultra-fast' ? (
              <Zap className="h-6 w-6" />
            ) : (
              <BatteryCharging className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className={cn(
              'font-semibold text-foreground',
              isFull && 'text-muted-foreground'
            )}>
              {charger.name}
            </h3>
            <p className={cn(
              'text-sm',
              selected ? 'text-gold-dark' : 'text-muted-foreground'
            )}>
              {charger.power} kW
            </p>
          </div>
        </div>
        
        <div className={cn(
          'rounded-full px-3 py-1 text-xs font-medium',
          isFull 
            ? 'bg-muted text-muted-foreground' 
            : selected
              ? 'bg-gold/20 text-gold-dark'
              : 'bg-gray-light text-muted-foreground'
        )}>
          {isFull ? t('full') : `${charger.availableSlots} ${t('availableSlots')}`}
        </div>
      </div>
      
      {/* Selection indicator */}
      {selected && !isFull && (
        <div className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-charcoal">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}
