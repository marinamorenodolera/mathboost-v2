'use client';
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useUserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadUserStats = async () => {
    if (!user) {
      console.log('🔍 loadUserStats: No user found, skipping')
      return
    }

    console.log('🔍 loadUserStats called with user:', { id: user.id, email: user.email })
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('📊 Stats query result:', { data, error })

      if (error) {
        console.error('❌ Error loading user stats:', error)
        
        // Si no existe el registro, crear uno por defecto
        if (error.code === 'PGRST116') {
          console.log('📝 Creating default stats record for user:', user.id)
          const defaultStats = {
            user_id: user.id,
            sessions_this_week: 0,
            sessions_last_week: 0,
            sessions_lifetime: 0,
            total_problems_this_week: 0,
            total_problems_last_week: 0,
            total_problems_lifetime: 0,
            average_response_time: 0,
            last_week_response_time: 0,
            current_streak: 0,
            best_streak: 0,
            consecutive_days: 0,
            current_level: 1,
            total_hours_invested: 0,
            next_level_problems: 50
          }
          setStats(defaultStats)
        } else {
          // Fallback con stats por defecto
          console.log('🔄 Using fallback default stats')
          setStats({
            sessions_this_week: 0,
            sessions_last_week: 0,
            sessions_lifetime: 0,
            total_problems_this_week: 0,
            total_problems_last_week: 0,
            total_problems_lifetime: 0,
            average_response_time: 0,
            last_week_response_time: 0,
            current_streak: 0,
            best_streak: 0,
            consecutive_days: 0,
            current_level: 1,
            total_hours_invested: 0,
            next_level_problems: 50
          })
        }
        return
      }

      setStats(data)
      console.log('✅ Stats cargadas correctamente:', data)
    } catch (error) {
      console.error('❌ Catch error loading user stats:', error)
      // Fallback con stats por defecto
      console.log('🔄 Using fallback default stats (catch)')
      setStats({
        sessions_this_week: 0,
        sessions_last_week: 0,
        sessions_lifetime: 0,
        total_problems_this_week: 0,
        total_problems_last_week: 0,
        total_problems_lifetime: 0,
        average_response_time: 0,
        last_week_response_time: 0,
        current_streak: 0,
        best_streak: 0,
        consecutive_days: 0,
        current_level: 1,
        total_hours_invested: 0,
        next_level_problems: 50
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserStats()
  }, [user])

  // Suscribirse a cambios en las stats
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('user_stats_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📊 Stats actualizadas:', payload.new)
          setStats(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return {
    stats,
    loading,
    refreshStats: loadUserStats
  }
}