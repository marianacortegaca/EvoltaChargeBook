'use client'

import { useState, useMemo, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { ChargerCard } from '@/components/reservation/charger-card'
import { DatePicker } from '@/components/reservation/date-picker'
import { TimeSlots } from '@/components/reservation/time-slots'
import { ReservationSummary } from '@/components/reservation/reservation-summary'
import { MyReservations } from '@/components/reservation/my-reservations'
import { SuccessModal } from '@/components/reservation/success-modal'
import { ConfirmationModal } from '@/components/reservation/confirmation-modal'
import { chargers, generateTimeSlots, formatDate } from '@/lib/data'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { useReservations, isSuperUser } from '@/hooks/use-reservations'
import type { Charger } from '@/lib/types'

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { reservations, createReservation, deleteReservation, getUserReservations } = useReservations()
  
  // Reservation state
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  
  // UI state
  const [showReservations, setShowReservations] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successData, setSuccessData] = useState({ chargerName: '', date: '', time: '' })
  
  // Get user's reservations (super user sees all, regular users see only their own)
  const userReservations = useMemo(() => {
    if (!user) return []
    // Super user sees all reservations
    if (isSuperUser(user.email)) {
      return reservations
    }
    // Regular users see only their own
    return getUserReservations(user.id)
  }, [user, reservations, getUserReservations])
  
  // Generate time slots based on selected charger, date and existing reservations
  const timeSlots = useMemo(() => {
    if (!selectedCharger) return []
    return generateTimeSlots(selectedCharger.id, formatDate(selectedDate), reservations)
  }, [selectedCharger, selectedDate, reservations])
  
  // Handle charger selection
  const handleSelectCharger = useCallback((charger: Charger) => {
    if (selectedCharger?.id === charger.id) {
      setSelectedCharger(null)
      setSelectedSlots([])
    } else {
      setSelectedCharger(charger)
      setSelectedSlots([])
    }
  }, [selectedCharger])
  
  // Handle date selection
  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedSlots([])
  }, [])
  
  // Handle slot toggle
  const handleToggleSlot = useCallback((time: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time)
      }
      return [...prev, time].sort()
    })
  }, [])
  
  // Calculate time range
  const getTimeRange = useCallback((slots: string[]): string => {
    if (slots.length === 0) return ''
    const sorted = [...slots].sort()
    const start = sorted[0]
    const lastSlot = sorted[sorted.length - 1]
    const [hours, minutes] = lastSlot.split(':').map(Number)
    const endMinutes = minutes + 15
    const endHours = endMinutes >= 60 ? hours + 1 : hours
    const end = `${endHours.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`
    return `${start} - ${end}`
  }, [])

  // Open confirmation modal
  const handleOpenConfirmation = useCallback(() => {
    if (selectedCharger && selectedSlots.length > 0) {
      setShowConfirmation(true)
    }
  }, [selectedCharger, selectedSlots])
  
  // Handle final reservation confirmation with vehicle plate
  const handleConfirm = useCallback(async (vehiclePlate: string) => {
    if (!selectedCharger || selectedSlots.length === 0 || !user) return
    
    setIsConfirming(true)
    
    const result = await createReservation(
      user.id,
      selectedCharger.id,
      selectedCharger.name,
      formatDate(selectedDate),
      selectedSlots,
      user.name,
      vehiclePlate
    )
    
    if (result.success) {
      // Show success modal
      const days = t('days') as string[]
      const months = t('months') as string[]
      setSuccessData({
        chargerName: selectedCharger.name,
        date: `${days[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`,
        time: getTimeRange(selectedSlots),
      })
      
      setShowConfirmation(false)
      setShowSuccess(true)
      
      // Reset selection
      setSelectedCharger(null)
      setSelectedSlots([])
    }
    
    setIsConfirming(false)
  }, [selectedCharger, selectedDate, selectedSlots, getTimeRange, user, createReservation])
  
  // Handle success modal close
  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false)
  }, [])
  
  return (
    <div className="min-h-screen bg-background pb-48 md:pb-8">
      <Header onShowReservations={() => setShowReservations(true)} />
      
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('heroDescription')}
          </p>
        </section>
        
        {/* Charger Selection */}
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('selectCharger')}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {chargers.map(charger => (
              <ChargerCard
                key={charger.id}
                charger={charger}
                selected={selectedCharger?.id === charger.id}
                onSelect={() => handleSelectCharger(charger)}
              />
            ))}
          </div>
        </section>
        
        {/* Date Picker - Only show when charger is selected */}
        {selectedCharger && (
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {t('selectDate')}
            </h2>
            <DatePicker
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </section>
        )}
        
        {/* Time Slots - Only show when charger and date are selected */}
        {selectedCharger && (
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {t('selectTimeSlots')}
            </h2>
            <TimeSlots
              slots={timeSlots}
              selectedSlots={selectedSlots}
              onToggleSlot={handleToggleSlot}
            />
          </section>
        )}
        
        {/* Reservation Summary - Desktop only inline version */}
        <div className="hidden md:block">
          <ReservationSummary
            charger={selectedCharger}
            date={selectedDate}
            selectedSlots={selectedSlots}
            onConfirm={handleOpenConfirmation}
            isConfirming={false}
          />
        </div>
      </main>
      
      {/* Reservation Summary - Mobile sticky bottom */}
      <div className="md:hidden">
        <ReservationSummary
          charger={selectedCharger}
          date={selectedDate}
          selectedSlots={selectedSlots}
          onConfirm={handleOpenConfirmation}
          isConfirming={false}
        />
      </div>
      
      {/* Confirmation Modal */}
      {selectedCharger && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          charger={selectedCharger}
          date={formatDate(selectedDate)}
          timeRange={getTimeRange(selectedSlots)}
          duration={selectedSlots.length * 15}
          isConfirming={isConfirming}
        />
      )}
      
      {/* My Reservations Modal */}
      <MyReservations
        reservations={userReservations}
        currentUserId={user?.id || ''}
        currentUserEmail={user?.email || ''}
        isOpen={showReservations}
        onClose={() => setShowReservations(false)}
        onDelete={deleteReservation}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        chargerName={successData.chargerName}
        date={successData.date}
        time={successData.time}
      />
    </div>
  )
}
