#!/bin/bash

# Comprehensive Database Check Script
# This script provides detailed information about the current database state

SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc"

echo "🔍 VERIFICACIÓN COMPRENSIVA DE BASE DE DATOS"
echo "==========================================="

# Function to check table existence and count records
check_table_detailed() {
    local table_name="$1"
    echo -n "📋 Verificando $table_name: "
    
    # Check if table exists and get record count
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/$table_name?select=*" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "apikey: $SERVICE_KEY")
    
    if echo "$response" | grep -q "does not exist\|relation.*does not exist"; then
        echo "❌ NO EXISTE"
        return 1
    elif echo "$response" | grep -q "JWT expired\|Invalid.*key"; then
        echo "🔑 Error de autenticación"
        return 2
    else
        # Count records
        record_count=$(echo "$response" | jq '. | length' 2>/dev/null || echo "unknown")
        echo "✅ EXISTE ($record_count registros)"
        return 0
    fi
}

# Function to check table structure
check_table_structure() {
    local table_name="$1"
    echo "📊 Estructura de $table_name:"
    
    # Get table structure by trying to select with limit 0
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/$table_name?select=*&limit=0" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "apikey: $SERVICE_KEY")
    
    if echo "$response" | grep -q "does not exist"; then
        echo "   ❌ Tabla no existe"
    else
        echo "   ✅ Tabla accesible"
        # If jq is available, try to get more info
        if command -v jq &> /dev/null; then
            echo "   📝 Respuesta: $(echo "$response" | jq -c .)"
        else
            echo "   📝 Respuesta: $response"
        fi
    fi
    echo ""
}

# 1. Check all expected tables
echo "1️⃣ VERIFICACIÓN DE TABLAS PRINCIPALES:"
echo "======================================"

tables=("user_profiles" "user_stats" "problem_attempts" "training_sessions" "activity_heatmap")
existing_tables=()

for table in "${tables[@]}"; do
    if check_table_detailed "$table"; then
        existing_tables+=("$table")
    fi
done

echo ""
echo "2️⃣ ESTRUCTURA DETALLADA DE TABLAS:"
echo "=================================="

for table in "${existing_tables[@]}"; do
    check_table_structure "$table"
done

# 3. Try to get database schema information
echo "3️⃣ INFORMACIÓN DE ESQUEMA:"
echo "=========================="

# Try different approaches to get schema info
echo "📋 Intentando obtener información del esquema..."

# Method 1: Direct table query (usually won't work)
response=$(curl -s -X GET \
    "$SUPABASE_URL/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "apikey: $SERVICE_KEY")

if echo "$response" | grep -q "does not exist"; then
    echo "   ❌ information_schema.tables no accesible vía REST API"
else
    echo "   ✅ information_schema.tables accesible"
    echo "   📝 Respuesta: $response"
fi

# Method 2: Try SQL endpoint
echo ""
echo "📋 Intentando usar endpoint SQL..."
sql_response=$(curl -s -X POST \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "apikey: $SERVICE_KEY" \
    -d '{"sql": "SELECT table_name FROM information_schema.tables WHERE table_schema = '\''public'\''"}' \
    "$SUPABASE_URL/rest/v1/sql")

if echo "$sql_response" | grep -q "error\|Error"; then
    echo "   ❌ Endpoint SQL no disponible o error"
    echo "   📝 Respuesta: $sql_response"
else
    echo "   ✅ Endpoint SQL disponible"
    echo "   📝 Respuesta: $sql_response"
fi

echo ""
echo "4️⃣ RESUMEN FINAL:"
echo "================="
echo "📊 Tablas encontradas: ${#existing_tables[@]}"
for table in "${existing_tables[@]}"; do
    echo "   ✅ $table"
done

if [ ${#existing_tables[@]} -eq 0 ]; then
    echo "   🎉 Base de datos completamente limpia"
else
    echo "   ⚠️  Algunas tablas aún existen"
fi

echo ""
echo "💡 RECOMENDACIONES:"
echo "=================="
if [ ${#existing_tables[@]} -gt 0 ]; then
    echo "   Para un reset completo, usa una de estas opciones:"
    echo "   1. Supabase Dashboard > SQL Editor"
    echo "   2. psql con conexión directa"
    echo "   3. Cliente PostgreSQL con string de conexión"
    echo ""
    echo "   SQL para ejecutar manualmente:"
    echo "   -------------------------------"
    for table in "${existing_tables[@]}"; do
        echo "   DROP TABLE IF EXISTS $table CASCADE;"
    done
    echo "   DROP FUNCTION IF EXISTS create_user_profile() CASCADE;"
    echo "   DROP FUNCTION IF EXISTS update_user_stats_on_session_complete() CASCADE;"
else
    echo "   ✅ No se requiere acción adicional"
fi