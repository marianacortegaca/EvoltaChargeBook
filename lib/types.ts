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

// Location types
export interface Location {
  id: string
  name: string
  city: string
  available: boolean
  comingSoon?: boolean
}

// Slot capacity configuration
export const SLOT_MAX_CAPACITY = 3

export interface TimeSlot {
  id: string
  time: string
  available: boolean
  locationId?: string
  currentReservations: number // Number of current reservations (0-3)
  maxCapacity: number // Maximum capacity (3)
  reservations: Array<{ userName: string; vehiclePlate: string }> // List of all reservations for this slot
}

export interface Reservation {
  id: string
  userId: string
  locationId: string
  locationName: string
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
