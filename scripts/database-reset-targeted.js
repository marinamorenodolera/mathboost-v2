#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Direct configuration from .env.local
const SUPABASE_URL = 'https://wuxxpwwihazzkpqczahx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
})

async function executeCompleteReset() {
  console.log('🔄 EJECUTANDO RESET COMPLETO DE BASE DE DATOS...\n')
  
  try {
    // 1. First, check what tables exist before reset
    console.log('📋 1. Verificando tablas existentes ANTES del reset...')
    const { data: beforeTables, error: beforeError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
      })
    
    if (beforeError) {
      console.error('❌ Error verificando tablas antes:', beforeError)
      return
    }
    
    console.log('   Tablas encontradas antes del reset:', beforeTables?.map(t => t.table_name).join(', ') || 'Ninguna')
    
    // 2. Execute the complete reset SQL
    console.log('\n🗑️  2. Ejecutando SQL de reset completo...')
    
    const resetSQL = `
-- Eliminar todas las tablas existentes
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS problem_attempts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS activity_heatmap CASCADE;

-- Eliminar todas las funciones
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS update_user_stats_on_session_complete() CASCADE;

-- Eliminar todos los triggers
-- (se eliminan automáticamente con CASCADE)
    `
    
    const { error: resetError } = await supabase.rpc('exec_sql', {
      sql: resetSQL
    })
    
    if (resetError) {
      console.error('❌ Error ejecutando reset SQL:', resetError)
      return
    }
    
    console.log('   ✅ Reset SQL ejecutado exitosamente')
    
    // 3. Verify the database is clean
    console.log('\n🔍 3. Verificando que la base de datos esté limpia...')
    const { data: afterTables, error: afterError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
      })
    
    if (afterError) {
      console.error('❌ Error verificando tablas después:', afterError)
      return
    }
    
    console.log('   Tablas restantes después del reset:', afterTables?.map(t => t.table_name).join(', ') || 'Ninguna')
    
    // 4. Generate detailed report
    console.log('\n📊 REPORTE DETALLADO:')
    console.log('====================')
    console.log('📋 TABLAS ELIMINADAS:')
    console.log('   - training_sessions')
    console.log('   - problem_attempts')
    console.log('   - user_profiles')
    console.log('   - user_stats')
    console.log('   - activity_heatmap')
    
    console.log('\n🔧 FUNCIONES ELIMINADAS:')
    console.log('   - create_user_profile()')
    console.log('   - update_user_stats_on_session_complete()')
    
    console.log('\n⚡ TRIGGERS ELIMINADOS:')
    console.log('   - Todos los triggers eliminados automáticamente con CASCADE')
    
    console.log('\n🎯 ESTADO FINAL:')
    console.log(`   - Tablas restantes: ${afterTables?.length || 0}`)
    if (afterTables && afterTables.length > 0) {
      console.log(`   - Nombres: ${afterTables.map(t => t.table_name).join(', ')}`)
    } else {
      console.log('   - ✅ Base de datos completamente limpia')
    }
    
    console.log('\n🎉 RESET COMPLETADO EXITOSAMENTE!')
    console.log('   La base de datos está lista para el paso 2 del reset.')
    
  } catch (error) {
    console.error('\n❌ ERROR GENERAL:', error)
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeCompleteReset()
}

export default executeCompleteReset