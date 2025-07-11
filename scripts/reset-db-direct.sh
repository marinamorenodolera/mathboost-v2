#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkxODI4NSwiZXhwIjoyMDUxNDk0Mjg1fQ.8M8YYzwKEgB3l1wgQpjRzKZJRDZABMnApZjhWGWO1r8"

echo "🔄 RESET COMPLETO DE BASE DE DATOS SUPABASE"
echo "=========================================="

# Función para ejecutar SQL
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "🔧 $description"
    
    curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SERVICE_KEY" \
        -d "{\"sql\": \"$sql\"}" \
        > /tmp/supabase_response.json
    
    if cat /tmp/supabase_response.json | grep -q "error"; then
        echo "❌ Error: $(cat /tmp/supabase_response.json)"
        return 1
    else
        echo "✅ Completado"
        return 0
    fi
}

# 1. Crear función exec_sql si no existe
echo "📋 1. Preparando función de ejecución..."
execute_sql "CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS \$\$ BEGIN EXECUTE sql; END; \$\$ LANGUAGE plpgsql;" "Creando función exec_sql"

# 2. Listar tablas existentes
echo ""
echo "📋 2. Listando tablas existentes..."
curl -s -X GET \
    "$SUPABASE_URL/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "apikey: $SERVICE_KEY" \
    > /tmp/tables.json

echo "Tablas encontradas:"
cat /tmp/tables.json | grep -o '"table_name":"[^"]*"' | cut -d'"' -f4 | while read table; do
    echo "  - $table"
done

# 3. Eliminar tablas existentes (excepto system tables)
echo ""
echo "🗑️  3. Eliminando tablas existentes..."

cat /tmp/tables.json | grep -o '"table_name":"[^"]*"' | cut -d'"' -f4 | while read table; do
    if [[ ! "$table" =~ ^(auth|storage|realtime|schema_migrations) ]]; then
        echo "   Eliminando: $table"
        execute_sql "DROP TABLE IF EXISTS \"$table\" CASCADE;" "Eliminando $table"
    fi
done

# 4. Ejecutar esquema nuevo
echo ""
echo "🔧 4. Aplicando esquema MathBoost..."

# Leer el archivo SQL y ejecutar por partes
if [ -f "supabase/migrations/20250111_initial_schema.sql" ]; then
    echo "   Esquema encontrado, aplicando..."
    
    # Dividir en secciones y ejecutar
    
    # UUID Extension
    execute_sql "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" "Habilitando extensión UUID"
    
    # Crear tablas principales
    execute_sql "CREATE TABLE user_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE NOT NULL,
        avatar_url TEXT DEFAULT '👤',
        display_name TEXT,
        current_level INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );" "Creando tabla user_profiles"
    
    execute_sql "CREATE TABLE user_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
        sessions_this_week INTEGER DEFAULT 0,
        sessions_last_week INTEGER DEFAULT 0,
        sessions_lifetime INTEGER DEFAULT 0,
        total_problems_this_week INTEGER DEFAULT 0,
        total_problems_last_week INTEGER DEFAULT 0,
        total_problems_lifetime INTEGER DEFAULT 0,
        average_response_time DECIMAL(4,2) DEFAULT 0,
        last_week_response_time DECIMAL(4,2) DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        consecutive_days INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        total_hours_invested DECIMAL(6,2) DEFAULT 0,
        next_level_problems INTEGER DEFAULT 50,
        last_session_date DATE,
        best_table INTEGER,
        weakest_table INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id)
    );" "Creando tabla user_stats"
    
    execute_sql "CREATE TABLE game_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
        operation_type TEXT NOT NULL CHECK (operation_type IN ('multiplication', 'addition', 'subtraction')),
        selected_tables INTEGER[] DEFAULT '{}',
        number_range TEXT DEFAULT '1-9',
        session_time_limit INTEGER DEFAULT 300,
        total_problems INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        average_time DECIMAL(6,2) DEFAULT 0,
        session_duration INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
        started_at TIMESTAMPTZ DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );" "Creando tabla game_sessions"
    
    execute_sql "CREATE TABLE problem_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
        user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
        operation_type TEXT NOT NULL,
        number_1 INTEGER NOT NULL,
        number_2 INTEGER NOT NULL,
        correct_answer INTEGER NOT NULL,
        user_answer INTEGER,
        is_correct BOOLEAN,
        response_time DECIMAL(6,2),
        difficulty_level INTEGER DEFAULT 1,
        trick_used TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );" "Creando tabla problem_attempts"
    
    execute_sql "CREATE TABLE activity_heatmap (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
        week_start_date DATE NOT NULL,
        activity_data INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, week_start_date)
    );" "Creando tabla activity_heatmap"
    
    echo "✅ Tablas principales creadas"
    
else
    echo "❌ No se encontró el archivo de esquema"
    exit 1
fi

# 5. Verificar creación
echo ""
echo "🔍 5. Verificando tablas creadas..."
curl -s -X GET \
    "$SUPABASE_URL/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "apikey: $SERVICE_KEY" \
    > /tmp/new_tables.json

echo "Nuevas tablas:"
cat /tmp/new_tables.json | grep -o '"table_name":"[^"]*"' | cut -d'"' -f4 | while read table; do
    echo "  ✅ $table"
done

echo ""
echo "🎉 RESET COMPLETADO!"
echo "   - Base de datos limpia"
echo "   - Esquema MathBoost aplicado"
echo "   - Listo para implementar autenticación"

# Limpiar archivos temporales
rm -f /tmp/supabase_response.json /tmp/tables.json /tmp/new_tables.json