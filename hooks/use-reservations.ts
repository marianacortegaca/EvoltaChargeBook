'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Reservation } from '@/lib/types'

interface DbReservation {
  id: string
  user_id: string
  charger_id: string // Maps to locationId in new schema
  charger_name: string // Maps to locationName in new schema
  date: string
  slots: string[]
  user_name: string | null
  vehicle_plate: string | null
  status: string
  created_at: string
}

function mapDbToReservation(db: DbReservation): Reservation {
  return {
    id: db.id,
    userId: db.user_id,
    locationId: db.charger_id, // Database still uses charger_id column
    locationName: db.charger_name, // Database still uses charger_name column
    date: db.date,
    slots: db.slots,
    userName: db.user_name || undefined,
    vehiclePlate: db.vehicle_plate || undefined,
    status: db.status as 'pending' | 'confirmed' | 'cancelled',
    createdAt: db.created_at,
  }
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create a stable supabase client
  const supabase = useMemo(() => createClient(), [])

  // Fetch all reservations
  const fetchReservations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      setError(fetchError.message)
      setIsLoading(false)
      return
    }
    
    setReservations((data || []).map(mapDbToReservation))
    setIsLoading(false)
  }, [supabase])

  // Create a new reservation
  const createReservation = useCallback(async (
    userId: string,
    locationId: string,
    locationName: string,
    date: string,
    slots: string[],
    userName: string
  ): Promise<{ success: boolean; error?: string; reservation?: Reservation }> => {
    const { data, error: insertError } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        charger_id: locationId, // Database column still named charger_id
        charger_name: locationName, // Database column still named charger_name
        date,
        slots,
        user_name: userName,
        status: 'confirmed',
      })
      .select()
      .single()
    
    if (insertError) {
      return { success: false, error: insertError.message }
    }
    
    const newReservation = mapDbToReservation(data)
    setReservations(prev => [newReservation, ...prev])
    
    return { success: true, reservation: newReservation }
  }, [supabase])

  // Cancel a reservation (soft delete - marks as cancelled)
  const cancelReservation = useCallback(async (reservationId: string): Promise<{ success: boolean; error?: string }> => {
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
    
    if (updateError) {
      return { success: false, error: updateError.message }
    }
    
    setReservations(prev => prev.filter(r => r.id !== reservationId))
    
    return { success: true }
  }, [supabase])

  // Delete a reservation (hard delete - removes from database)
  const deleteReservation = useCallback(async (reservationId: string): Promise<{ success: boolean; error?: string }> => {
    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservationId)
    
    if (deleteError) {
      return { success: false, error: deleteError.message }
    }
    
    setReservations(prev => prev.filter(r => r.id !== reservationId))
    
    return { success: true }
  }, [supabase])

  // Get reservations for a specific user
  const getUserReservations = useCallback((userId: string) => {
    return reservations.filter(r => r.userId === userId)
  }, [reservations])

  // Initial fetch
  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  // Real-time subscription for reservation changes
  useEffect(() => {
    const channel = supabase
      .channel('reservations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
        },
        () => {
          // Refetch all reservations on any change
          fetchReservations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchReservations])

  return {
    reservations,
    isLoading,
    error,
    createReservation,
    cancelReservation,
    deleteReservation,
    getUserReservations,
    refetch: fetchReservations,
  }
}

// Super user email - has full access to all reservations
export const SUPER_USER_EMAIL = 'geral@evolta.pt'

export function isSuperUser(email: string | undefined): boolean {
  return email?.toLowerCase() === SUPER_USER_EMAIL.toLowerCase()
}
