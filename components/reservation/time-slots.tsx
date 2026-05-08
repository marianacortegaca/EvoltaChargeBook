'use client'

import { cn } from '@/lib/utils'
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

const TIME_PERIODS = [
  { name: 'Madrugada', start: 0, end: 6 },
  { name: 'Manhã', start: 6, end: 12 },
  { name: 'Tarde', start: 12, end: 18 },
  { name: 'Noite', start: 18, end: 24 },
]

export function TimeSlots({ slots, selectedSlots, onToggleSlot }: TimeSlotsProps) {
  const getSlotsByPeriod = (startHour: number, endHour: number) => {
    return slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return hour >= startHour && hour < endHour
    })
  }

  const SlotButton = ({ slot, isSelected }: { slot: TimeSlot; isSelected: boolean }) => {
    const button = (
      <button
        onClick={() => slot.available && onToggleSlot(slot.time)}
        disabled={!slot.available}
        className={cn(
          'rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold/50',
          slot.available
            ? isSelected
              ? 'bg-gold text-charcoal shadow-md'
              : 'bg-secondary text-foreground hover:bg-gold/20 hover:text-charcoal'
            : 'cursor-not-allowed bg-muted text-muted-foreground line-through opacity-50'
        )}
      >
        {slot.time}
      </button>
    )

    // Show tooltip only for reserved (unavailable) slots with reservedBy info
    if (!slot.available && slot.reservedBy) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>Reservado por: {slot.reservedBy}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {TIME_PERIODS.map(period => {
          const periodSlots = getSlotsByPeriod(period.start, period.end)
          if (periodSlots.length === 0) return null

          return (
            <div key={period.name}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {period.name}
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
