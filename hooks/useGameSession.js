'use client';
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useGameSession = () => {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const sessionStats = useRef({
    totalProblems: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalResponseTime: 0,
    problems: []
  })

  const startSession = async (operation, settings = {}) => {
    console.log('🎮 INICIO startSession:', { operation, settings, userId: user?.id })
    
    if (!user) {
      console.error('❌ Usuario no autenticado en startSession')
      throw new Error('Usuario no autenticado')
    }

    setLoading(true)
    
    try {
      // Campos correctos para la estructura real
      const sessionData = {
        user_id: user.id,
        operation_type: operation || 'multiplication',
        selected_tables: settings.selectedTables || [1,2,3,4,5,6,7,8,9,10],
        number_range: settings.difficulty || 'medium',
        total_problems: 0,
        correct_answers: 0,
        status: 'active',
        started_at: new Date().toISOString()
      }
      
      console.log('📤 Enviando datos de sesión:', sessionData)
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert(sessionData)
        .select()
        .single()

      console.log('📨 Respuesta de game_sessions:', { data, error })
      
      if (error) {
        console.error('❌ ERROR 400 DETALLADO:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          statusCode: error.statusCode,
          statusText: error.statusText
        })
        
        // Log adicional para debugging
        console.error('🔍 Datos que causaron el error:', sessionData)
        console.error('🔍 User ID que se usó:', user.id)
        console.error('🔍 Error completo:', error)
        
        throw error
      }

      setCurrentSession(data)
      
      // Reset session stats
      sessionStats.current = {
        totalProblems: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalResponseTime: 0,
        problems: []
      }

      console.log('✅ Sesión iniciada exitosamente:', data.id)
      return data
    } catch (error) {
      console.error('❌ Error al iniciar sesión (catch):', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const recordAnswer = async (problem, userAnswer, responseTime, isCorrect) => {
    console.log('💾 INICIO recordAnswer:', { 
      problem, userAnswer, responseTime, isCorrect,
      sessionId: currentSession?.id,
      userId: user?.id 
    })
    
    if (!currentSession) {
      console.warn('⚠️ No hay sesión activa')
      return
    }

    try {
      const attemptData = {
        session_id: currentSession.id,
        user_id: user.id,
        number_1: problem.number1,
        number_2: problem.number2,
        operation_type: problem.operation,
        correct_answer: problem.answer,
        user_answer: parseInt(userAnswer),
        response_time_ms: responseTime
        // is_correct se calcula automáticamente en Supabase
      }
      
      console.log('📤 Enviando datos de intento:', attemptData)
      console.log('🔍 DEBUGGING - Datos enviados:', JSON.stringify(attemptData, null, 2))
      
      const { data, error } = await supabase
        .from('problem_attempts')
        .insert(attemptData)
        .select()
        .single()

      console.log('📨 Respuesta de problem_attempts:', { data, error })
      console.log('📨 RESPUESTA SUPABASE data:', data)
      console.log('📨 RESPUESTA SUPABASE error:', error)
      console.log('📨 ERROR COMPLETO:', JSON.stringify(error, null, 2))
      
      if (error) {
        console.error('❌ Error específico al guardar respuesta:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      // Update session stats
      sessionStats.current.totalProblems += 1
      sessionStats.current.totalResponseTime += responseTime
      
      if (isCorrect) {
        sessionStats.current.correctAnswers += 1
      } else {
        sessionStats.current.incorrectAnswers += 1
      }

      sessionStats.current.problems.push({
        ...problem,
        userAnswer: parseInt(userAnswer),
        responseTime,
        isCorrect
      })

      console.log('✅ Respuesta guardada exitosamente:', data.id)
      return data
    } catch (error) {
      console.error('❌ Error al guardar respuesta (catch):', error)
      throw error
    }
  }

  const completeSession = async () => {
    console.log('🏁 INICIO completeSession:', { sessionId: currentSession?.id })
    
    if (!currentSession) {
      console.warn('⚠️ No hay sesión activa')
      return
    }

    try {
      const stats = sessionStats.current
      const averageResponseTime = stats.totalProblems > 0 
        ? (stats.totalResponseTime / stats.totalProblems / 1000).toFixed(2) 
        : 0

      const accuracy = stats.totalProblems > 0 
        ? ((stats.correctAnswers / stats.totalProblems) * 100).toFixed(1)
        : 0

      // Campos correctos para la estructura real
      const sessionDuration = Math.floor((new Date() - new Date(currentSession.started_at)) / 1000)
      
      const updateData = {
        status: 'completed',
        total_problems: stats.totalProblems,
        correct_answers: stats.correctAnswers,
        session_duration_seconds: sessionDuration,
        completed_at: new Date().toISOString()
      }
      
      console.log('📤 Completando sesión con datos:', updateData)

      const { data, error } = await supabase
        .from('game_sessions')
        .update(updateData)
        .eq('id', currentSession.id)
        .select()
        .single()

      console.log('📨 Respuesta de completar sesión:', { data, error })

      if (error) {
        console.error('❌ Error específico al completar sesión:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('✅ Sesión completada exitosamente:', data.id)
      console.log('📊 Stats finales:', {
        totalProblems: stats.totalProblems,
        correctAnswers: stats.correctAnswers,
        accuracy: accuracy + '%',
        averageResponseTime: averageResponseTime + 's'
      })

      setCurrentSession(null)
      return data
    } catch (error) {
      console.error('❌ Error al completar sesión (catch):', error)
      throw error
    }
  }

  const getSessionStats = () => {
    return {
      ...sessionStats.current,
      accuracy: sessionStats.current.totalProblems > 0 
        ? ((sessionStats.current.correctAnswers / sessionStats.current.totalProblems) * 100).toFixed(1)
        : 0,
      averageResponseTime: sessionStats.current.totalProblems > 0 
        ? (sessionStats.current.totalResponseTime / sessionStats.current.totalProblems / 1000).toFixed(2)
        : 0
    }
  }

  return {
    currentSession,
    loading,
    startSession,
    recordAnswer,
    completeSession,
    getSessionStats
  }
}