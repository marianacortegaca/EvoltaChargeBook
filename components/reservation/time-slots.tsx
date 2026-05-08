'use client'

import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/lib/types'

interface TimeSlotsProps {
  slots: TimeSlot[]
  selectedSlots: string[]
  onToggleSlot: (time: string) => void
}

export function TimeSlots({ slots, selectedSlots, onToggleSlot }: TimeSlotsProps) {
  // Group slots by hour for visual organization
  const hourGroups = slots.reduce((acc, slot) => {
    const hour = slot.time.split(':')[0]
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)
  
  return (
    <div className="space-y-4">
      {Object.entries(hourGroups).map(([hour, hourSlots]) => (
        <div key={hour}>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            {hour}:00
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hourSlots.map((slot) => {
              const isSelected = selectedSlots.includes(slot.time)
              
              return (
                <button
                  key={slot.id}
                  onClick={() => slot.available && onToggleSlot(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    'rounded-xl py-3 text-sm font-medium transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1',
                    slot.available && isSelected && 'bg-gold text-charcoal shadow-md shadow-gold/20',
                    slot.available && !isSelected && 'border-2 border-gold/30 bg-background text-foreground hover:border-gold hover:bg-gold/5',
                    !slot.available && 'cursor-not-allowed bg-muted text-muted-foreground/50 line-through'
                  )}
                >
                  {slot.time}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
