'use client'

import { X, Zap, Calendar, Clock, BatteryCharging } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Reservation } from '@/lib/types'

interface MyReservationsProps {
  reservations: Reservation[]
  isOpen: boolean
  onClose: () => void
}

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`
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

export function MyReservations({ reservations, isOpen, onClose }: MyReservationsProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 backdrop-blur-sm md:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-t-3xl bg-background shadow-2xl md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">As minhas reservas</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {reservations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-light">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Ainda não tem reservas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-2xl border border-border p-4 transition-colors hover:bg-gray-light/50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        reservation.status === 'confirmed' ? 'bg-gold/10' : 'bg-gray-light'
                      )}>
                        {reservation.chargerName.includes('Ultra') ? (
                          <Zap className={cn(
                            'h-5 w-5',
                            reservation.status === 'confirmed' ? 'text-gold' : 'text-muted-foreground'
                          )} />
                        ) : (
                          <BatteryCharging className={cn(
                            'h-5 w-5',
                            reservation.status === 'confirmed' ? 'text-gold' : 'text-muted-foreground'
                          )} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{reservation.chargerName}</p>
                        <p className="text-sm text-muted-foreground">{reservation.vehiclePlate}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(reservation.date)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {getTimeRange(reservation.slots)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
