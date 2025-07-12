'use client';
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { LEVEL_SYSTEM } from '../lib/levelSystem'

export const useUserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadCompleteStats = async () => {
    if (!user) {
      console.log('🔍 No user found, clearing stats')
      setStats(null)
      return
    }
    
    try {
      console.log('🔍 Loading complete stats for user:', user.id)
      setLoading(true)
      
      // Usar la función SQL optimizada
      const { data, error } = await supabase
        .rpc('get_complete_user_stats', { target_user_id: user.id })
      
      console.log('📨 RPC response:', { data, error })
      
      if (error) {
        console.error('❌ Error calling get_complete_user_stats:', error)
        throw error
      }
      
      if (data && data.length > 0) {
        const completeStats = data[0]
        console.log('📊 Complete stats loaded:', completeStats)
        console.log('🔍 Checking avg_response_time fields:')
        console.log('   - avg_response_time_week:', completeStats.avg_response_time_week)
        console.log('   - avg_response_time_this_week:', completeStats.avg_response_time_this_week)
        console.log('   - average_response_time:', completeStats.average_response_time)
        console.log('   - All fields:', Object.keys(completeStats))
        
        // DEBUG ESPECÍFICO para avg_response_time
        console.log('🔍 DEBUG avg_response_time:', {
          raw_avg_response_time_week: completeStats.avg_response_time_week,
          parsed: parseFloat(completeStats.avg_response_time_week || 0),
          type: typeof completeStats.avg_response_time_week
        })
        
        // CALCULAR INFORMACIÓN ÉPICA DE NIVELES
        const currentXP = completeStats.current_xp || 0
        const levelProgression = LEVEL_SYSTEM.getLevelFromXP(currentXP)
        
        // Transformar nombres de campos para compatibilidad EXACTA con UI
        const transformedStats = {
          // MAPEO EXACTO para WelcomeScreen.jsx
          problems_this_week: completeStats.problems_this_week || 0,           // "2/100"
          avg_response_time_week: parseFloat(completeStats.avg_response_time_week || 0), // "2.5s/5s" - CAMPO CORRECTO
          current_streak: completeStats.current_streak || 0,                  // rachas
          best_streak: completeStats.best_streak || 0,                        // rachas
          sessions_this_week: completeStats.sessions_this_week || 0,          // sesiones semanales
          total_hours_invested: parseFloat(completeStats.total_hours_invested || 0), // HORAS TOTALES HISTÓRICAS (más motivador)
          
          // SISTEMA ÉPICO DE PROGRESIÓN
          current_level: levelProgression.current_level,                      // nivel actual
          level_name: levelProgression.level_info.name,                       // "Aprendiz", "Explorador", etc.
          level_icon: levelProgression.level_info.icon,                       // 🌱, 🔍, etc.
          level_color: levelProgression.level_info.color,                     // Color hex
          level_description: levelProgression.level_info.description,         // Descripción épica
          current_xp: levelProgression.current_xp,                           // XP total
          xp_in_current_level: levelProgression.xp_in_current_level,         // XP en nivel actual
          xp_for_next_level: levelProgression.xp_for_next_level,             // XP para siguiente
          progress_percentage: levelProgression.progress_percentage,          // % progreso nivel
          weekly_problems_goal: levelProgression.weekly_goal,                 // meta semanal
          next_level_name: levelProgression.next_level_info?.name || "¡Máximo nivel!",
          next_level_icon: levelProgression.next_level_info?.icon || "🏆",
          
          // CAMPOS LEGACY (para compatibilidad)
          total_problems_this_week: completeStats.problems_this_week || 0,    // alias
          average_response_time: parseFloat(completeStats.avg_response_time_week || 0), // CAMPO PRINCIPAL que usa WelcomeScreen - CORREGIDO
          
          // Stats lifetime
          total_sessions_lifetime: completeStats.total_sessions || 0,
          total_problems_lifetime: completeStats.total_problems || 0,
          correct_problems_lifetime: completeStats.correct_problems || 0,
          
          // Campos adicionales
          accuracy_this_week: completeStats.accuracy_this_week || 0,
          
          // Debug info
          _sql_response: completeStats
        }
        
        console.log('✅ Transformed stats for UI:', transformedStats)
        console.log('🎯 KEY FIELDS for WelcomeScreen:')
        console.log('   - problems_this_week:', transformedStats.problems_this_week)
        console.log('   - average_response_time:', transformedStats.average_response_time, '(type:', typeof transformedStats.average_response_time, ')')
        console.log('   - sessions_this_week:', transformedStats.sessions_this_week)
        console.log('   - total_hours_invested:', transformedStats.total_hours_invested, '(TOTAL HISTÓRICO)')
        
        console.log('📊 COMPARACIÓN HORAS:')
        console.log('   - Horas esta semana:', parseFloat(completeStats.hours_this_week || 0))
        console.log('   - Horas TOTALES (más motivador):', transformedStats.total_hours_invested)
        
        console.log('⚡ SISTEMA ÉPICO DE NIVELES:')
        console.log(`   - Nivel: ${transformedStats.current_level} ${transformedStats.level_icon} "${transformedStats.level_name}"`)
        console.log(`   - XP: ${transformedStats.xp_in_current_level}/${transformedStats.xp_in_current_level + transformedStats.xp_for_next_level} (${transformedStats.progress_percentage}%)`)
        console.log(`   - Próximo: ${transformedStats.next_level_icon} "${transformedStats.next_level_name}"`)
        console.log(`   - Meta semanal: ${transformedStats.weekly_problems_goal} problemas`)
        console.log(`   - Descripción: "${transformedStats.level_description}"`)
        
        // VERIFICACIÓN FINAL
        console.log('🔍 VERIFICATION - Raw vs Transformed:')
        console.log('   Raw avg_response_time_week:', completeStats.avg_response_time_week)
        console.log('   Transformed average_response_time:', transformedStats.average_response_time)
        setStats(transformedStats)
      } else {
        console.log('⚠️ No stats data returned, using defaults')
        setStats({
          // MAPEO EXACTO para WelcomeScreen.jsx  
          problems_this_week: 0,
          avg_response_time_week: 0,
          current_streak: 0,
          best_streak: 0,
          sessions_this_week: 0,
          total_hours_invested: 0, // TOTAL HISTÓRICO por defecto
          
          // PROGRESIÓN
          current_level: 1,
          current_xp: 0,
          xp_for_next_level: 100,
          weekly_problems_goal: 50,
          
          // ALIASES
          total_problems_this_week: 0,
          average_response_time: 0,
          
          // LIFETIME
          total_sessions_lifetime: 0,
          total_problems_lifetime: 0,
          correct_problems_lifetime: 0,
          accuracy_this_week: 0
        })
      }
      
    } catch (error) {
      console.error('❌ Error loading complete stats:', error)
      // Fallback to defaults on error
      setStats({
        // MAPEO EXACTO para WelcomeScreen.jsx  
        problems_this_week: 0,
        avg_response_time_week: 0,
        current_streak: 0,
        best_streak: 0,
        sessions_this_week: 0,
        total_hours_invested: 0, // TOTAL HISTÓRICO por defecto
        
        // PROGRESIÓN
        current_level: 1,
        current_xp: 0,
        xp_for_next_level: 100,
        weekly_problems_goal: 50,
        
        // ALIASES
        total_problems_this_week: 0,
        average_response_time: 0,
        
        // LIFETIME
        total_sessions_lifetime: 0,
        total_problems_lifetime: 0,
        correct_problems_lifetime: 0,
        accuracy_this_week: 0
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompleteStats()
  }, [user])

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('user_stats_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📊 user_stats updated, reloading complete stats...')
          loadCompleteStats()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🎮 game_sessions updated, reloading complete stats...')
          loadCompleteStats()
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
    reloadStats: loadCompleteStats,
    refreshStats: loadCompleteStats, // Alias para compatibilidad
    LEVEL_SYSTEM // Sistema de niveles disponible para componentes
  }
}