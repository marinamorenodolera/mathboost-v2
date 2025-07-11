#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://wuxxpwwihazzkpqczahx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkxODI4NSwiZXhwIjoyMDUxNDk0Mjg1fQ.8M8YYzwKEgB3l1wgQpjRzKZJRDZABMnApZjhWGWO1r8'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
})

async function resetDatabase() {
  console.log('🔄 INICIANDO RESET COMPLETO DE LA BASE DE DATOS...\n')
  
  try {
    // 1. Listar todas las tablas existentes
    console.log('📋 1. Listando tablas existentes...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations')
    
    if (tablesError) {
      console.error('❌ Error listando tablas:', tablesError)
      return
    }
    
    console.log(`   Encontradas ${tables?.length || 0} tablas:`, tables?.map(t => t.table_name).join(', '))
    
    // 2. Eliminar todas las tablas (excepto system tables)
    if (tables && tables.length > 0) {
      console.log('\n🗑️  2. Eliminando tablas existentes...')
      
      for (const table of tables) {
        if (!table.table_name.startsWith('auth') && 
            !table.table_name.startsWith('storage') &&
            !table.table_name.startsWith('realtime') &&
            table.table_name !== 'schema_migrations') {
          
          console.log(`   Eliminando tabla: ${table.table_name}`)
          
          const { error } = await supabase.rpc('exec_sql', {
            sql: `DROP TABLE IF EXISTS "${table.table_name}" CASCADE;`
          })
          
          if (error) {
            console.warn(`   ⚠️  Error eliminando ${table.table_name}:`, error.message)
          } else {
            console.log(`   ✅ Eliminada: ${table.table_name}`)
          }
        }
      }
    }
    
    // 3. Leer y ejecutar el esquema nuevo
    console.log('\n📄 3. Cargando esquema nuevo...')
    const schemaPath = path.join(process.cwd(), 'supabase/migrations/20250111_initial_schema.sql')
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ No se encontró el archivo de esquema:', schemaPath)
      return
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    console.log(`   Esquema cargado (${schemaSQL.length} caracteres)`)
    
    // 4. Ejecutar el esquema
    console.log('\n🔧 4. Ejecutando esquema nuevo...')
    
    // Dividir el SQL en statements individuales y ejecutar uno por uno
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`   Ejecutando ${statements.length} statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          })
          
          if (error) {
            console.warn(`   ⚠️  Error en statement ${i + 1}:`, error.message)
          } else {
            console.log(`   ✅ Statement ${i + 1}/${statements.length} ejecutado`)
          }
        } catch (err) {
          console.warn(`   ⚠️  Error ejecutando statement ${i + 1}:`, err.message)
        }
      }
    }
    
    // 5. Verificar que las tablas se crearon correctamente
    console.log('\n🔍 5. Verificando tablas creadas...')
    const { data: newTables, error: newTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (newTablesError) {
      console.error('❌ Error verificando tablas:', newTablesError)
      return
    }
    
    console.log(`   ✅ Tablas creadas: ${newTables?.map(t => t.table_name).join(', ')}`)
    
    console.log('\n🎉 RESET COMPLETADO EXITOSAMENTE!')
    console.log('   - Base de datos limpia')
    console.log('   - Esquema MathBoost aplicado')
    console.log('   - Listo para usar')
    
  } catch (error) {
    console.error('\n❌ ERROR GENERAL:', error)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase()
}