// TEST DIRECTO DE SUPABASE
import { supabase } from './lib/supabase.js'

async function testSupabaseConnection() {
  console.log('🧪 INICIANDO TEST DE SUPABASE...')
  
  try {
    // 1. Test de autenticación
    console.log('1️⃣ Verificando sesión actual...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('📊 Sesión actual:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      error: sessionError 
    })
    
    // 2. Test de lectura de tablas
    console.log('2️⃣ Testeando lectura de tablas...')
    
    const tables = ['user_profiles', 'user_stats', 'game_sessions', 'problem_attempts']
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        console.log(`📋 Tabla ${table}:`, { 
          existe: !error, 
          count,
          error: error?.message 
        })
      } catch (err) {
        console.log(`❌ Error tabla ${table}:`, err.message)
      }
    }
    
    // 3. Test de inserción si hay usuario
    if (session?.user?.id) {
      console.log('3️⃣ Testeando inserción de datos...')
      
      // Test insertar game_session con campos mínimos
      try {
        console.log('🧪 Probando INSERT mínimo (sin settings)...')
        const testData = {
          user_id: session.user.id,
          operation_type: 'test',
          status: 'test'
        }
        console.log('📤 Test data:', testData)
        
        const { data, error } = await supabase
          .from('game_sessions')
          .insert(testData)
          .select()
        
        console.log('🎮 Test game_sessions:', { data, error })
        
        // Si se insertó, limpiar
        if (data?.[0]?.id) {
          await supabase
            .from('game_sessions')
            .delete()
            .eq('id', data[0].id)
          console.log('🧹 Test session eliminada')
        }
      } catch (err) {
        console.log('❌ Error insertando game_session:', err)
      }
    }
    
  } catch (error) {
    console.error('🚨 ERROR GENERAL EN TEST:', error)
  }
}

// Solo ejecutar en browser
if (typeof window !== 'undefined') {
  window.testSupabase = testSupabaseConnection
  console.log('🔧 Test function disponible como window.testSupabase()')
}

export { testSupabaseConnection }