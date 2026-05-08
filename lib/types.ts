// Auth types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Charger types
export interface Charger {
  id: string
  name: string
  type: 'ultra-fast' | 'fast'
  power: number
  availableSlots: number
  totalSlots: number
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
  chargerId?: string
}

export interface Reservation {
  id: string
  userId: string
  chargerId: string
  chargerName: string
  date: string
  slots: string[]
  userName?: string
  vehiclePlate?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface DayOption {
  date: Date
  dayName: string
  dayNumber: number
  monthName: string
  isToday: boolean
}
