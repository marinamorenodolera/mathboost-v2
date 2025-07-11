#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTk0ODgsImV4cCI6MjA2NzQ5NTQ4OH0.H6UV-qhm-TQNaNEBn_V72C2CAKCzQmdgsd6yCPEOGkA"

echo "🔍 VERIFICACIÓN DIRECTA DE TABLAS"
echo "==============================="

# 1. Verificar qué tablas existen intentando hacer SELECT
echo "📋 1. Verificando tablas existentes..."

tables=("user_profiles" "user_stats" "problem_attempts" "training_sessions" "game_sessions" "activity_heatmap")

for table in "${tables[@]}"; do
    echo -n "  Verificando $table: "
    
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/$table?select=*&limit=0" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "apikey: $ANON_KEY")
    
    if echo "$response" | grep -q "does not exist\|relation.*does not exist"; then
        echo "❌ NO EXISTE"
    elif echo "$response" | grep -q "JWT expired\|Invalid.*key"; then
        echo "🔑 Error de autenticación"
    elif echo "$response" | grep -q "\[\]"; then
        echo "✅ EXISTE (vacía)"
    else
        echo "✅ EXISTE"
    fi
done

echo ""
echo "📋 2. Verificando estructura usando information_schema..."

# Intentar acceder a information_schema con diferentes métodos
curl -s -X GET \
    "$SUPABASE_URL/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "apikey: $ANON_KEY" \
    > /tmp/tables_check.json

echo "Respuesta de información de tablas:"
cat /tmp/tables_check.json
echo ""

# Limpiar
rm -f /tmp/tables_check.json