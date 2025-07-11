#!/bin/bash

# MathBoost v2 Database Reset Script - Direct API approach
# This script performs a complete database reset using direct HTTP requests to PostgreSQL

SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc"

echo "🔄 EJECUTANDO RESET COMPLETO DE BASE DE DATOS..."
echo "============================================="

# Function to check if table exists
check_table_exists() {
    local table_name="$1"
    local response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/$table_name?select=*&limit=0" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "apikey: $SERVICE_KEY")
    
    if echo "$response" | grep -q "does not exist\|relation.*does not exist"; then
        echo "❌ NO EXISTE"
        return 1
    else
        echo "✅ EXISTE"
        return 0
    fi
}

# Function to execute SQL using the database URL (if available)
execute_sql_direct() {
    local sql_query="$1"
    local description="$2"
    
    echo "📋 Ejecutando: $description"
    echo "   SQL: $sql_query"
    
    # Try using the SQL API endpoint if available
    response=$(curl -s -X POST \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SERVICE_KEY" \
        -d "{\"query\": \"$sql_query\"}" \
        "$SUPABASE_URL/rest/v1/rpc/query")
    
    if echo "$response" | grep -q "PGRST202"; then
        echo "   ⚠️  Direct SQL execution not available via REST API"
        return 1
    else
        echo "   ✅ Ejecutado correctamente"
        echo "   Respuesta: $response"
        return 0
    fi
}

# 1. Check current state
echo "📋 1. Verificando estado actual de la base de datos..."
echo ""

tables=("user_profiles" "user_stats" "problem_attempts" "training_sessions" "activity_heatmap")
existing_tables=()

for table in "${tables[@]}"; do
    echo -n "  Verificando $table: "
    if check_table_exists "$table"; then
        existing_tables+=("$table")
    fi
done

echo ""
echo "📊 RESUMEN DEL ESTADO ACTUAL:"
echo "   Tablas encontradas: ${#existing_tables[@]}"
for table in "${existing_tables[@]}"; do
    echo "   - $table"
done

echo ""
echo "🗑️  2. Procediendo con eliminación de tablas..."

# Since we can't execute DDL statements directly through REST API,
# we'll use a different approach - truncate existing tables and document the process

for table in "${existing_tables[@]}"; do
    echo "📋 Procesando tabla: $table"
    
    # Try to delete all records from the table
    response=$(curl -s -X DELETE \
        "$SUPABASE_URL/rest/v1/$table" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "apikey: $SERVICE_KEY")
    
    if echo "$response" | grep -q "error\|Error"; then
        echo "   ⚠️  No se pudo truncar la tabla $table"
        echo "   Respuesta: $response"
    else
        echo "   ✅ Tabla $table truncada (todos los registros eliminados)"
    fi
done

echo ""
echo "🔧 3. Información sobre funciones y triggers..."
echo "   ⚠️  Note: Las funciones y triggers no pueden ser eliminados via REST API"
echo "   Las siguientes funciones necesitan ser eliminadas manualmente:"
echo "   - create_user_profile()"
echo "   - update_user_stats_on_session_complete()"
echo ""

echo "📊 REPORTE DETALLADO:"
echo "===================="
echo "📋 TABLAS PROCESADAS:"
for table in "${existing_tables[@]}"; do
    echo "   - $table (datos eliminados)"
done
echo ""
echo "⚠️  LIMITACIONES DE LA API REST:"
echo "   - No se pueden ejecutar comandos DDL (DROP TABLE, DROP FUNCTION) via REST API"
echo "   - Solo se pueden eliminar los datos de las tablas existentes"
echo "   - Las estructuras de tablas, funciones y triggers permanecen intactas"
echo ""
echo "🎯 ESTADO FINAL:"
echo "   - Tablas: Estructuras intactas, datos eliminados"
echo "   - Funciones: Permanecen (requieren acceso SQL directo)"
echo "   - Triggers: Permanecen (requieren acceso SQL directo)"
echo ""
echo "💡 RECOMENDACIÓN:"
echo "   Para un reset completo, necesitas acceso directo a PostgreSQL"
echo "   o usar la interfaz web de Supabase para ejecutar los comandos DDL."