'use client'

import { useState, useMemo, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { LocationCard } from '@/components/reservation/location-card'
import { DatePicker } from '@/components/reservation/date-picker'
import { TimeSlots } from '@/components/reservation/time-slots'
import { ReservationSummary } from '@/components/reservation/reservation-summary'
import { MyReservations } from '@/components/reservation/my-reservations'
import { SuccessModal } from '@/components/reservation/success-modal'
import { ConfirmationModal } from '@/components/reservation/confirmation-modal'
import { locations, generateTimeSlots, formatDate } from '@/lib/data'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { useReservations, isSuperUser } from '@/hooks/use-reservations'
import type { Location } from '@/lib/types'

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { reservations, createReservation, deleteReservation, getUserReservations } = useReservations()
  
  // Reservation state
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  
  // UI state
  const [showReservations, setShowReservations] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successData, setSuccessData] = useState({ locationName: '', date: '', time: '' })
  
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
  
  // Generate time slots based on selected location, date and existing reservations
  const timeSlots = useMemo(() => {
    if (!selectedLocation) return []
    return generateTimeSlots(selectedLocation.id, formatDate(selectedDate), reservations)
  }, [selectedLocation, selectedDate, reservations])
  
  // Handle location selection
  const handleSelectLocation = useCallback((location: Location) => {
    if (!location.available) return
    
    if (selectedLocation?.id === location.id) {
      setSelectedLocation(null)
      setSelectedSlots([])
    } else {
      setSelectedLocation(location)
      setSelectedSlots([])
    }
  }, [selectedLocation])
  
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
    if (selectedLocation && selectedSlots.length > 0) {
      setShowConfirmation(true)
    }
  }, [selectedLocation, selectedSlots])
  
  // Handle final reservation confirmation
  const handleConfirm = useCallback(async () => {
    if (!selectedLocation || selectedSlots.length === 0 || !user) return
    
    setIsConfirming(true)
    
    const locationDisplayName = `${selectedLocation.city} | ${selectedLocation.name}`
    
    const result = await createReservation(
      user.id,
      selectedLocation.id,
      locationDisplayName,
      formatDate(selectedDate),
      selectedSlots,
      user.name
    )
    
    if (result.success) {
      // Show success modal
      const days = t('days') as string[]
      const months = t('months') as string[]
      setSuccessData({
        locationName: locationDisplayName,
        date: `${days[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`,
        time: getTimeRange(selectedSlots),
      })
      
      setShowConfirmation(false)
      setShowSuccess(true)
      
      // Reset selection
      setSelectedLocation(null)
      setSelectedSlots([])
    }
    
    setIsConfirming(false)
  }, [selectedLocation, selectedDate, selectedSlots, getTimeRange, user, createReservation, t])
  
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
        
        {/* Location Selection */}
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('selectLocation')}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {locations.map(location => (
              <LocationCard
                key={location.id}
                location={location}
                selected={selectedLocation?.id === location.id}
                onSelect={() => handleSelectLocation(location)}
              />
            ))}
          </div>
        </section>
        
        {/* Date Picker - Only show when location is selected */}
        {selectedLocation && (
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
        
        {/* Time Slots - Only show when location and date are selected */}
        {selectedLocation && (
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
            location={selectedLocation}
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
          location={selectedLocation}
          date={selectedDate}
          selectedSlots={selectedSlots}
          onConfirm={handleOpenConfirmation}
          isConfirming={false}
        />
      </div>
      
      {/* Confirmation Modal */}
      {selectedLocation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          locationName={`${selectedLocation.city} | ${selectedLocation.name}`}
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
        locationName={successData.locationName}
        date={successData.date}
        time={successData.time}
      />
    </div>
  )
}
