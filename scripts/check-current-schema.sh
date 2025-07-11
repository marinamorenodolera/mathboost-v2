#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc"

echo "🔍 VERIFICACIÓN DETALLADA DEL ESQUEMA ACTUAL"
echo "=========================================="

# Función para ejecutar consultas
query_db() {
    local sql="$1"
    local description="$2"
    
    echo "📋 $description"
    
    curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SERVICE_KEY" \
        -d "{\"sql\": \"$sql\"}" \
        > /tmp/query_result.json
    
    echo "$(cat /tmp/query_result.json)"
    echo ""
}

# 1. Listar todas las tablas
query_db "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" "1. Tablas existentes"

# 2. Verificar columnas de cada tabla
echo "📋 2. Estructura de tablas"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' ORDER BY ordinal_position;" "user_profiles - columnas"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_stats' ORDER BY ordinal_position;" "user_stats - columnas"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'problem_attempts' ORDER BY ordinal_position;" "problem_attempts - columnas"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'training_sessions' ORDER BY ordinal_position;" "training_sessions - columnas"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'game_sessions' ORDER BY ordinal_position;" "game_sessions - columnas (si existe)"

query_db "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'activity_heatmap' ORDER BY ordinal_position;" "activity_heatmap - columnas (si existe)"

# 3. Verificar triggers
query_db "SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public' ORDER BY event_object_table, trigger_name;" "3. Triggers existentes"

# 4. Verificar políticas RLS
query_db "SELECT schemaname, tablename, policyname, permissive FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;" "4. Políticas RLS"

# 5. Verificar RLS habilitado
query_db "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" "5. Estado RLS"

echo "🔍 VERIFICACIÓN COMPLETADA"

# Limpiar
rm -f /tmp/query_result.json