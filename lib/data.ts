import type { Charger, TimeSlot, Reservation } from './types'

export const chargers: Charger[] = [
  {
    id: 'charger-1',
    name: 'Ultra Fast Charger',
    type: 'ultra-fast',
    power: 150,
    availableSlots: 2,
    totalSlots: 2,
  },
  {
    id: 'charger-2',
    name: 'Fast Charger',
    type: 'fast',
    power: 60,
    availableSlots: 2,
    totalSlots: 2,
  },
]

// Generate time slots from 00:00 to 23:45 in 15-minute intervals
export function generateTimeSlots(chargerId: string, date: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotId = `${chargerId}-${date}-${time}`
      
      slots.push({
        id: slotId,
        time,
        available: true, // All slots available - will be managed by database in production
        chargerId,
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
