'use client';
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect iniciado')
    
    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      console.log('⚠️ TIMEOUT: Forzando loading = false después de 5s')
      setLoading(false)
    }, 5000)

    // Get initial session
    console.log('📡 Intentando getSession...')
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        console.log('✅ getSession respuesta:', { session: !!session, error })
        clearTimeout(safetyTimeout)
        
        setUser(session?.user ?? null)
        if (session?.user) {
          console.log('👤 Usuario encontrado, cargando perfil...')
          loadUserProfile(session.user.id)
        } else {
          console.log('❌ No hay usuario logueado')
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('🚨 Error en getSession:', error)
        clearTimeout(safetyTimeout)
        setLoading(false)
      })

    // Simplificar listener por ahora
    console.log('👂 Configurando listener de auth...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state cambió:', event, !!session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      console.log('🧹 Limpiando AuthProvider...')
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      console.log('🔍 INICIO loadUserProfile')
      console.log('📋 userId recibido:', userId)
      
      if (!userId) {
        console.error('❌ No userId provided to loadUserProfile')
        return
      }

      // Verificar estado de autenticación actual
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      console.log('🔐 Auth check:', { 
        currentUserId: currentUser?.id,
        providedUserId: userId,
        match: currentUser?.id === userId 
      })
      
      // Query a user_profiles
      console.log('📊 Ejecutando query a user_profiles...')
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('📊 Profile query completo:', { 
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
        errorHint: error?.hint,
        data
      })

      if (error || !data) {
        console.error('❌ Error o sin datos al cargar profile:', {
          error,
          message: error?.message || 'No data returned',
          code: error?.code || 'NO_DATA',
          userId
        })
        
        // Si no existe el perfil, intentar crearlo
        if (error?.code === 'PGRST116' || !data) {
          console.log('📝 Profile no encontrado, creando uno nuevo...')
          
          // Intentar crear el perfil
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              username: `user_${userId.substring(0, 8)}`,
              avatar_url: '👤',
              display_name: 'Usuario',
              current_level: 1
            })
            .select()
            .single()
          
          if (createError) {
            console.error('❌ Error creando profile:', createError)
            // Usar perfil por defecto sin guardar en BD
            const defaultProfile = {
              id: userId,
              username: 'usuario',
              avatar_url: '👤',
              display_name: 'Usuario',
              current_level: 1
            }
            setProfile(defaultProfile)
            
            // También crear user_stats por defecto
            console.log('📊 Creando user_stats por defecto...')
            await supabase
              .from('user_stats')
              .insert({ user_id: userId })
              .select()
          } else {
            console.log('✅ Profile creado exitosamente:', newProfile)
            setProfile(newProfile)
            
            // También crear user_stats
            console.log('📊 Creando user_stats para nuevo profile...')
            await supabase
              .from('user_stats')
              .insert({ user_id: userId })
              .select()
          }
        } else {
          // Otro tipo de error, usar fallback
          console.log('🔄 Usando perfil por defecto (fallback)')
          setProfile({
            id: userId,
            username: 'usuario',
            avatar_url: '👤', 
            display_name: 'Usuario',
            current_level: 1
          })
        }
        return
      }

      console.log('✅ Perfil cargado exitosamente:', data)
      setProfile(data)
      
      // Verificar si existe user_stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('id')
        .eq('user_id', userId)
        .single()
      
      if (statsError || !statsData) {
        console.log('📊 No hay user_stats, creando...')
        await supabase
          .from('user_stats')
          .insert({ user_id: userId })
          .select()
      }
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO en loadUserProfile:', error)
      // Fallback con perfil por defecto
      console.log('🔄 Usando perfil por defecto (catch)')
      setProfile({
        id: userId,
        username: 'usuario',
        avatar_url: '👤',
        display_name: 'Usuario', 
        current_level: 1
      })
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: metadata.username || email.split('@')[0],
            avatar_url: metadata.avatar_url || '👤'
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setProfile(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}