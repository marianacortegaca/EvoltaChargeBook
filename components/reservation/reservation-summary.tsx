'use client'

import { Zap, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Charger } from '@/lib/types'

interface ReservationSummaryProps {
  charger: Charger | null
  date: Date | null
  selectedSlots: string[]
  onConfirm: () => void
  isConfirming: boolean
}

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function formatDateLong(date: Date): string {
  return `${dayNames[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]}`
}

function calculateDuration(slots: string[]): string {
  const minutes = slots.length * 15
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}min`
}

function getTimeRange(slots: string[]): string {
  if (slots.length === 0) return ''
  const sorted = [...slots].sort()
  const start = sorted[0]
  const lastSlot = sorted[sorted.length - 1]
  const [hours, minutes] = lastSlot.split(':').map(Number)
  const endMinutes = minutes + 15
  const endHours = endMinutes >= 60 ? hours + 1 : hours
  const end = `${endHours.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`
  return `${start} - ${end}`
}

export function ReservationSummary({
  charger,
  date,
  selectedSlots,
  onConfirm,
  isConfirming,
}: ReservationSummaryProps) {
  const isReady = charger && date && selectedSlots.length > 0
  
  if (!isReady) return null
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:relative md:inset-auto md:mt-8 md:rounded-2xl md:border md:p-6 md:shadow-lg">
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Resumo da reserva
        </h3>
        
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Zap className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{charger.name}</p>
              <p className="text-xs text-muted-foreground">{charger.power} kW</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Calendar className="h-4 w-4 text-gold" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDateLong(date)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Clock className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {getTimeRange(selectedSlots)}
              </p>
              <p className="text-xs text-muted-foreground">
                Duração: {calculateDuration(selectedSlots)}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onConfirm}
          disabled={isConfirming}
          className={cn(
            'w-full rounded-xl bg-charcoal py-6 text-base font-semibold text-white',
            'transition-all duration-200',
            'hover:bg-charcoal/90 hover:shadow-lg hover:shadow-gold/20',
            'active:scale-[0.98]',
            'disabled:opacity-70'
          )}
        >
          {isConfirming ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              A confirmar...
            </span>
          ) : (
            'Confirmar reserva'
          )}
        </Button>
      </div>
    </div>
  )
}
