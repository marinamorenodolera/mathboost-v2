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
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          operation_type: operation,
          settings: settings,
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setCurrentSession(data)
      
      // Reset session stats
      sessionStats.current = {
        totalProblems: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalResponseTime: 0,
        problems: []
      }

      console.log('✅ Sesión iniciada:', data.id)
      return data
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const recordAnswer = async (problem, userAnswer, responseTime, isCorrect) => {
    if (!currentSession) {
      console.warn('⚠️ No hay sesión activa')
      return
    }

    try {
      const { data, error } = await supabase
        .from('problem_attempts')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          number_1: problem.number1,
          number_2: problem.number2,
          operation: problem.operation,
          correct_answer: problem.answer,
          user_answer: parseInt(userAnswer),
          response_time: responseTime,
          is_correct: isCorrect
        })
        .select()
        .single()

      if (error) throw error

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

      console.log('✅ Respuesta guardada:', data.id)
      return data
    } catch (error) {
      console.error('❌ Error al guardar respuesta:', error)
      throw error
    }
  }

  const completeSession = async () => {
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

      const sessionDuration = new Date() - new Date(currentSession.started_at)

      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_problems: stats.totalProblems,
          correct_answers: stats.correctAnswers,
          incorrect_answers: stats.incorrectAnswers,
          accuracy_percentage: parseFloat(accuracy),
          average_response_time: parseFloat(averageResponseTime),
          session_duration: Math.round(sessionDuration / 1000) // segundos
        })
        .eq('id', currentSession.id)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Sesión completada:', data.id)
      console.log('📊 Stats finales:', {
        totalProblems: stats.totalProblems,
        correctAnswers: stats.correctAnswers,
        accuracy: accuracy + '%',
        averageResponseTime: averageResponseTime + 's'
      })

      setCurrentSession(null)
      return data
    } catch (error) {
      console.error('❌ Error al completar sesión:', error)
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