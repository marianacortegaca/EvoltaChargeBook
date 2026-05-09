import type { Location, TimeSlot, Reservation, SLOT_MAX_CAPACITY } from './types'

export const locations: Location[] = [
  {
    id: 'location-lisboa',
    name: 'Prior Velho',
    city: 'Lisboa',
    available: true,
  },
  {
    id: 'location-porto',
    name: 'Porto',
    city: 'Porto',
    available: false,
    comingSoon: true,
  },
]

// Maximum capacity per slot
const MAX_CAPACITY = 3

// Generate time slots from 00:00 to 23:45 in 15-minute intervals
// Each slot can have up to 3 reservations
export function generateTimeSlots(locationId: string, date: string, reservations: Reservation[] = []): TimeSlot[] {
  const slots: TimeSlot[] = []
  
  // Find all reservations for this location and date
  const dayReservations = (reservations || []).filter(
    res => res.locationId === locationId && res.date === date && res.status !== 'cancelled'
  )
  
  // Create a map of reserved slots with all user info
  const slotReservationsMap = new Map<string, Array<{ userName: string; vehiclePlate: string }>>()
  dayReservations.forEach(res => {
    res.slots.forEach(slot => {
      const existing = slotReservationsMap.get(slot) || []
      existing.push({
        userName: res.userName || 'Utilizador',
        vehiclePlate: res.vehiclePlate || '',
      })
      slotReservationsMap.set(slot, existing)
    })
  })
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotId = `${locationId}-${date}-${time}`
      const slotReservations = slotReservationsMap.get(time) || []
      const currentCount = slotReservations.length
      
      slots.push({
        id: slotId,
        time,
        available: currentCount < MAX_CAPACITY,
        locationId,
        currentReservations: currentCount,
        maxCapacity: MAX_CAPACITY,
        reservations: slotReservations,
      })
    }
  }
  
  return slots
}

// Initial empty reservations - will be managed by database in production
export const mockReservations: Reservation[] = []

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
