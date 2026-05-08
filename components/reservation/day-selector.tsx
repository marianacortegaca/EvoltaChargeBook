'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DaySelectorProps {
  days: Date[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function DaySelector({ days, selectedDate, onSelectDate }: DaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  useEffect(() => {
    // Scroll to selected date on mount
    if (scrollRef.current) {
      const selectedIndex = days.findIndex(
        d => d.toDateString() === selectedDate.toDateString()
      )
      if (selectedIndex > 0) {
        const scrollAmount = selectedIndex * 76 - 20
        scrollRef.current.scrollLeft = scrollAmount
      }
    }
  }, [])
  
  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {days.map((day) => {
        const isSelected = day.toDateString() === selectedDate.toDateString()
        const isToday = day.toDateString() === today.toDateString()
        
        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={cn(
              'flex min-w-[4.25rem] flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
              isSelected
                ? 'bg-gold text-charcoal shadow-lg shadow-gold/25'
                : 'bg-gray-light text-foreground hover:bg-gold/10'
            )}
          >
            <span className={cn(
              'text-xs font-medium uppercase tracking-wide',
              isSelected ? 'text-charcoal/70' : 'text-muted-foreground'
            )}>
              {dayNames[day.getDay()]}
            </span>
            <span className={cn(
              'text-xl font-semibold',
              isSelected ? 'text-charcoal' : 'text-foreground'
            )}>
              {day.getDate()}
            </span>
            <span className={cn(
              'text-xs',
              isSelected ? 'text-charcoal/70' : 'text-muted-foreground'
            )}>
              {monthNames[day.getMonth()]}
            </span>
            {isToday && !isSelected && (
              <div className="h-1 w-1 rounded-full bg-gold" />
            )}
          </button>
        )
      })}
    </div>
  )
}
