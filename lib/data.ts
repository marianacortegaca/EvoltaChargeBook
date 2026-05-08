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
// Checks against existing reservations to mark slots as unavailable
export function generateTimeSlots(chargerId: string, date: string, reservations: Reservation[] = []): TimeSlot[] {
  const slots: TimeSlot[] = []
  
  // Find all reservations for this charger and date
  const dayReservations = (reservations || []).filter(
    res => res.chargerId === chargerId && res.date === date && res.status !== 'cancelled'
  )
  
  // Create a map of reserved slots with user info
  const reservedSlots = new Map<string, { userName: string; vehiclePlate: string }>()
  dayReservations.forEach(res => {
    res.slots.forEach(slot => {
      reservedSlots.set(slot, {
        userName: res.userName || 'Utilizador',
        vehiclePlate: res.vehiclePlate || '',
      })
    })
  })
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotId = `${chargerId}-${date}-${time}`
      const reservedInfo = reservedSlots.get(time)
      
      slots.push({
        id: slotId,
        time,
        available: !reservedInfo,
        chargerId,
        reservedBy: reservedInfo ? `${reservedInfo.userName} (${reservedInfo.vehiclePlate})` : undefined,
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
