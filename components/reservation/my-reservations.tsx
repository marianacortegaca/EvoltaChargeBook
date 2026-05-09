'use client'

import { useState } from 'react'
import { X, MapPin, Calendar, Clock, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { isSuperUser } from '@/hooks/use-reservations'
import type { Reservation } from '@/lib/types'

interface MyReservationsProps {
  reservations: Reservation[]
  currentUserId: string
  currentUserEmail: string
  isOpen: boolean
  onClose: () => void
  onDelete: (reservationId: string) => Promise<{ success: boolean; error?: string }>
}

function formatDate(dateStr: string, t: (key: string) => string | string[]): string {
  const date = new Date(dateStr)
  const days = t('days') as string[]
  const months = t('months') as string[]
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()].substring(0, 3)}`
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

export function MyReservations({ 
  reservations, 
  currentUserId,
  currentUserEmail,
  isOpen, 
  onClose,
  onDelete 
}: MyReservationsProps) {
  const { t } = useLanguage()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const isSuper = isSuperUser(currentUserEmail)

  const canDelete = (reservation: Reservation): boolean => {
    // Super user can delete any reservation
    if (isSuper) return true
    // Regular users can only delete their own reservations
    return reservation.userId === currentUserId
  }

  const handleDeleteClick = (reservationId: string) => {
    setConfirmDeleteId(reservationId)
  }

  const handleConfirmDelete = async (reservationId: string) => {
    setDeletingId(reservationId)
    await onDelete(reservationId)
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const handleCancelDelete = () => {
    setConfirmDeleteId(null)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 backdrop-blur-sm md:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-t-3xl bg-background shadow-2xl md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">{t('myReservationsTitle')}</h2>
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
              <p className="font-medium text-foreground">{t('noReservations')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('noReservationsDescription')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-2xl border border-border p-4 transition-colors hover:bg-gray-light/50"
                >
                  {confirmDeleteId === reservation.id ? (
                    <div className="space-y-3">
                      <p className="text-sm text-foreground">{t('deleteConfirmation')}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleConfirmDelete(reservation.id)}
                          disabled={deletingId === reservation.id}
                        >
                          {deletingId === reservation.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            t('confirm')
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelDelete}
                          disabled={deletingId === reservation.id}
                        >
                          {t('cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl',
                            reservation.status === 'confirmed' ? 'bg-gold/10' : 'bg-gray-light'
                          )}>
                            <MapPin className={cn(
                              'h-5 w-5',
                              reservation.status === 'confirmed' ? 'text-gold' : 'text-muted-foreground'
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{reservation.locationName}</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.vehiclePlate}
                              {isSuper && reservation.userId !== currentUserId && (
                                <span className="ml-2 text-xs text-gold">({reservation.userName})</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-medium',
                            reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          )}>
                            {reservation.status === 'confirmed' ? t('confirmed') : t('pending')}
                          </span>
                          {canDelete(reservation) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(reservation.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(reservation.date, t)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {getTimeRange(reservation.slots)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
