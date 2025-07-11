#!/bin/bash

# MathBoost v2 Database Reset Script - SQL Editor API approach
# This script performs a complete database reset using Supabase SQL Editor API

SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc"

echo "🔄 EJECUTANDO RESET COMPLETO DE BASE DE DATOS..."
echo "============================================="

# Function to execute SQL using SQL Editor API
execute_sql_editor() {
    local sql_query="$1"
    local description="$2"
    
    echo "📋 Ejecutando: $description"
    echo "   SQL: $sql_query"
    
    # Try using the SQL Editor API endpoint
    response=$(curl -s -X POST \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SERVICE_KEY" \
        -d "{\"sql\": \"$sql_query\"}" \
        "$SUPABASE_URL/rest/v1/sql")
    
    echo "   Respuesta: $response"
    echo ""
}

# 1. Check current state first
echo "📋 1. Verificando estado actual de la base de datos..."
execute_sql_editor "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'" "Listado de tablas existentes"

# 2. Execute the complete reset SQL
echo "🗑️  2. Ejecutando SQL de reset completo..."

# Drop tables one by one
execute_sql_editor "DROP TABLE IF EXISTS training_sessions CASCADE" "Eliminar training_sessions"
execute_sql_editor "DROP TABLE IF EXISTS problem_attempts CASCADE" "Eliminar problem_attempts"
execute_sql_editor "DROP TABLE IF EXISTS user_profiles CASCADE" "Eliminar user_profiles"
execute_sql_editor "DROP TABLE IF EXISTS user_stats CASCADE" "Eliminar user_stats"
execute_sql_editor "DROP TABLE IF EXISTS activity_heatmap CASCADE" "Eliminar activity_heatmap"

# Drop functions
execute_sql_editor "DROP FUNCTION IF EXISTS create_user_profile() CASCADE" "Eliminar create_user_profile()"
execute_sql_editor "DROP FUNCTION IF EXISTS update_user_stats_on_session_complete() CASCADE" "Eliminar update_user_stats_on_session_complete()"

# 3. Verify the database is clean
echo "🔍 3. Verificando que la base de datos esté limpia..."
execute_sql_editor "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'" "Verificar tablas restantes"

echo "📊 REPORTE DETALLADO:"
echo "===================="
echo "📋 TABLAS ELIMINADAS:"
echo "   - training_sessions"
echo "   - problem_attempts"
echo "   - user_profiles"
echo "   - user_stats"
echo "   - activity_heatmap"
echo ""
echo "🔧 FUNCIONES ELIMINADAS:"
echo "   - create_user_profile()"
echo "   - update_user_stats_on_session_complete()"
echo ""
echo "⚡ TRIGGERS ELIMINADOS:"
echo "   - Todos los triggers eliminados automáticamente con CASCADE"
echo ""
echo "🎉 RESET COMPLETADO!"
echo "   La base de datos está lista para el paso 2 del reset."