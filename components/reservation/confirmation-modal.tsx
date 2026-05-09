'use client'

import { useState } from 'react'
import { X, MapPin, Calendar, Clock, Car, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (vehiclePlate: string) => Promise<void>
  locationName: string
  date: string
  timeRange: string
  duration: number
  isConfirming: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  locationName,
  date,
  timeRange,
  duration,
  isConfirming,
}: ConfirmationModalProps) {
  const { t } = useLanguage()
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!vehiclePlate.trim()) {
      setError(t('fillAllFields') as string)
      return
    }

    await onConfirm(vehiclePlate.trim().toUpperCase())
    setVehiclePlate('')
  }

  const handleClose = () => {
    if (!isConfirming) {
      setVehiclePlate('')
      setError('')
      onClose()
    }
  }

  if (!isOpen) return null

  const dateObj = new Date(date)
  const days = t('days') as string[]
  const months = t('months') as string[]
  const formattedDate = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-background shadow-2xl md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">{t('confirmReservationTitle')}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isConfirming}
            className="h-9 w-9 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Reservation Summary */}
          <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{locationName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{timeRange}</span>
                <span className="text-muted-foreground">({duration} min)</span>
              </div>
            </div>
          </div>

          {/* Vehicle Plate Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate" className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                {t('vehiclePlate')}
              </Label>
              <Input
                id="vehiclePlate"
                type="text"
                placeholder={t('vehiclePlatePlaceholder') as string}
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                disabled={isConfirming}
                className={cn(
                  'text-center text-lg font-medium tracking-wider uppercase',
                  error && 'border-destructive'
                )}
                maxLength={10}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isConfirming}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gold text-charcoal hover:bg-gold-dark"
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loggingIn')}
                  </>
                ) : (
                  t('confirmReservation')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
