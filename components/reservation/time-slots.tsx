'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { TimeSlot } from '@/lib/types'

interface TimeSlotsProps {
  slots: TimeSlot[]
  selectedSlots: string[]
  onToggleSlot: (time: string) => void
}

const TIME_PERIOD_KEYS = [
  { key: 'dawn', start: 0, end: 6 },
  { key: 'morning', start: 6, end: 12 },
  { key: 'afternoon', start: 12, end: 18 },
  { key: 'evening', start: 18, end: 24 },
] as const

// PANTONE colors converted to hex
// PANTONE 12-0230 TCX Scenic Green -> #9ACD9A (approximation)
// PANTONE 11-0617 TCX Transparent Yellow -> #F5E6A3 (approximation)
const SLOT_COLORS = {
  empty: 'bg-[#9ACD9A] text-charcoal hover:bg-[#8BC48B]', // 0/3 - Green
  partial: 'bg-[#F5E6A3] text-charcoal hover:bg-[#EDD98F]', // 1/3 or 2/3 - Yellow
  full: 'bg-muted text-muted-foreground', // 3/3 - Grey (unavailable)
  selected: 'bg-gold text-charcoal shadow-md', // Selected by user
}

export function TimeSlots({ slots, selectedSlots, onToggleSlot }: TimeSlotsProps) {
  const { t } = useLanguage()
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)

  const getSlotsByPeriod = (startHour: number, endHour: number) => {
    return slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return hour >= startHour && hour < endHour
    })
  }

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      onToggleSlot(slot.time)
      setOpenTooltip(null)
    } else if (slot.reservations.length > 0) {
      // Toggle tooltip on click for mobile devices
      setOpenTooltip(openTooltip === slot.id ? null : slot.id)
    }
  }

  const getSlotColorClass = (slot: TimeSlot, isSelected: boolean): string => {
    if (isSelected) return SLOT_COLORS.selected
    
    const count = slot.currentReservations
    if (count === 0) return SLOT_COLORS.empty
    if (count < slot.maxCapacity) return SLOT_COLORS.partial
    return SLOT_COLORS.full
  }

  const SlotButton = ({ slot, isSelected }: { slot: TimeSlot; isSelected: boolean }) => {
    const isTooltipOpen = openTooltip === slot.id
    const hasReservations = slot.reservations.length > 0
    const isFull = slot.currentReservations >= slot.maxCapacity

    const button = (
      <button
        onClick={() => handleSlotClick(slot)}
        disabled={isFull}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold/50',
          getSlotColorClass(slot, isSelected),
          isFull && 'cursor-not-allowed opacity-60'
        )}
      >
        <span className={cn(isFull && 'line-through')}>{slot.time}</span>
        <span className="text-[10px] opacity-70">
          {slot.currentReservations}/{slot.maxCapacity}
        </span>
      </button>
    )

    // Show tooltip for slots with reservations
    if (hasReservations) {
      return (
        <Tooltip open={isTooltipOpen} onOpenChange={(open) => setOpenTooltip(open ? slot.id : null)}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              {slot.reservations.map((res, idx) => (
                <p key={idx} className="text-sm">
                  {t('plannedBy')}: {res.userName}
                </p>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-[#9ACD9A]" />
            <span>{t('available')} (0/3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-[#F5E6A3]" />
            <span>Parcial (1-2/3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-muted" />
            <span>{t('full')} (3/3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-gold" />
            <span>Selecionado</span>
          </div>
        </div>

        {TIME_PERIOD_KEYS.map(period => {
          const periodSlots = getSlotsByPeriod(period.start, period.end)
          if (periodSlots.length === 0) return null

          return (
            <div key={period.key}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {t(period.key)}
              </h3>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {periodSlots.map((slot) => (
                  <SlotButton 
                    key={slot.id} 
                    slot={slot} 
                    isSelected={selectedSlots.includes(slot.time)} 
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
