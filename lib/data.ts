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

// Generate time slots from 08:00 to 18:00 in 15-minute intervals
export function generateTimeSlots(chargerId: string, date: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  const unavailableSlots = getUnavailableSlots(chargerId, date)
  
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotId = `${chargerId}-${date}-${time}`
      
      slots.push({
        id: slotId,
        time,
        available: !unavailableSlots.includes(time),
        chargerId,
      })
    }
  }
  
  return slots
}

// Mock unavailable slots (simulating existing reservations)
function getUnavailableSlots(chargerId: string, date: string): string[] {
  // Create some realistic unavailable slots based on charger and date
  const today = new Date().toISOString().split('T')[0]
  
  if (date === today) {
    if (chargerId === 'charger-1') {
      return ['09:00', '09:15', '09:30', '10:00', '10:15', '14:00', '14:15', '14:30', '14:45']
    }
    if (chargerId === 'charger-2') {
      return ['08:30', '08:45', '11:00', '11:15', '11:30', '15:00', '15:15']
    }
  }
  
  // Less busy on other days
  if (chargerId === 'charger-1') {
    return ['10:00', '10:15', '14:00', '14:15']
  }
  
  return ['09:00', '09:15', '15:30', '15:45']
}

// Mock reservations for "My Reservations" feature
export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    userId: 'demo-user',
    chargerId: 'charger-1',
    chargerName: 'Ultra Fast Charger',
    date: new Date().toISOString().split('T')[0],
    slots: ['09:00', '09:15', '09:30'],
    userName: 'João Silva',
    vehiclePlate: '00-AA-00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'res-2',
    userId: 'demo-user',
    chargerId: 'charger-2',
    chargerName: 'Fast Charger',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slots: ['14:00', '14:15'],
    userName: 'Maria Santos',
    vehiclePlate: '11-BB-22',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getNextDays(count: number = 7): Date[] {
  const days: Date[] = []
  const today = new Date()
  
  for (let i = 0; i < count; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() + i)
    days.push(day)
  }
  
  return days
}
