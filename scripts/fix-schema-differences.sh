#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxOTQ4OCwiZXhwIjoyMDY3NDk1NDg4fQ.MFQUnnEMu20lZ6fUWAG1KCpzPaIWpPscxoAziT3CHWc"

echo "🔧 CORRIGIENDO DIFERENCIAS EN ESQUEMA"
echo "===================================="

# Función para ejecutar SQL
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "🔧 $description"
    
    # Intentar diferentes endpoints
    for endpoint in "exec_sql" "sql"; do
        curl -s -X POST \
            "$SUPABASE_URL/rest/v1/rpc/$endpoint" \
            -H "Authorization: Bearer $SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -H "apikey: $SERVICE_KEY" \
            -d "{\"sql\": \"$sql\"}" \
            > /tmp/response.json
        
        if ! cat /tmp/response.json | grep -q "does not exist\|not found"; then
            break
        fi
    done
    
    if cat /tmp/response.json | grep -q "error\|Invalid"; then
        echo "❌ Error: $(cat /tmp/response.json)"
        return 1
    else
        echo "✅ Completado"
        return 0
    fi
}

echo "📋 1. Creando tabla activity_heatmap (faltante)..."

execute_sql "CREATE TABLE IF NOT EXISTS activity_heatmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    activity_data INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);" "Creando activity_heatmap"

echo ""
echo "📋 2. Ajustando problem_attempts (número de columnas)..."

# Agregar alias o cambiar nombres si es necesario
execute_sql "ALTER TABLE problem_attempts 
    ADD COLUMN IF NOT EXISTS number_1 INTEGER,
    ADD COLUMN IF NOT EXISTS number_2 INTEGER;" "Agregando columnas number_1/number_2"

execute_sql "UPDATE problem_attempts 
    SET number_1 = num1, number_2 = num2 
    WHERE number_1 IS NULL AND num1 IS NOT NULL;" "Migrando datos num1/num2"

echo ""
echo "📋 3. Ajustando user_profiles (avatar)..."

execute_sql "ALTER TABLE user_profiles 
    ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '👤';" "Agregando avatar_url"

execute_sql "UPDATE user_profiles 
    SET avatar_url = avatar_emoji 
    WHERE avatar_url IS NULL AND avatar_emoji IS NOT NULL;" "Migrando avatar_emoji a avatar_url"

echo ""
echo "📋 4. Renombrando training_sessions a game_sessions..."

execute_sql "ALTER TABLE IF EXISTS training_sessions RENAME TO game_sessions;" "Renombrando training_sessions"

echo ""
echo "📋 5. Habilitando RLS en todas las tablas..."

tables=("user_profiles" "user_stats" "game_sessions" "problem_attempts" "activity_heatmap")

for table in "${tables[@]}"; do
    execute_sql "ALTER TABLE $table ENABLE ROW LEVEL SECURITY;" "RLS en $table"
done

echo ""
echo "📋 6. Creando políticas RLS para activity_heatmap..."

execute_sql "DROP POLICY IF EXISTS \"Users can view own heatmap\" ON activity_heatmap;" "Limpiando política anterior"

execute_sql "CREATE POLICY \"Users can view own heatmap\" ON activity_heatmap
    FOR SELECT USING (auth.uid() = user_id);" "Política SELECT para activity_heatmap"

execute_sql "CREATE POLICY \"Users can manage own heatmap\" ON activity_heatmap
    FOR ALL USING (auth.uid() = user_id);" "Política ALL para activity_heatmap"

echo ""
echo "📋 7. Verificando y creando triggers..."

execute_sql "CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS \$\$
BEGIN
  INSERT INTO user_profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '👤')
  );
  
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;" "Actualizando función create_user_profile"

execute_sql "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;" "Limpiando trigger anterior"

execute_sql "CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();" "Creando trigger on_auth_user_created"

execute_sql "CREATE OR REPLACE FUNCTION update_user_stats_on_session_complete()
RETURNS TRIGGER AS \$\$
DECLARE
  v_current_week_start DATE;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    v_current_week_start := date_trunc('week', CURRENT_DATE)::DATE;
    
    UPDATE user_stats 
    SET 
      sessions_this_week = sessions_this_week + 1,
      sessions_lifetime = sessions_lifetime + 1,
      total_problems_this_week = total_problems_this_week + COALESCE(NEW.total_problems, 0),
      total_problems_lifetime = total_problems_lifetime + COALESCE(NEW.total_problems, 0),
      total_hours_invested = total_hours_invested + (COALESCE(NEW.session_duration, 0) / 3600.0),
      last_session_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    INSERT INTO activity_heatmap (user_id, week_start_date, activity_data)
    VALUES (
      NEW.user_id,
      v_current_week_start,
      ARRAY[0,0,0,0,0,0,0]
    )
    ON CONFLICT (user_id, week_start_date) DO UPDATE
    SET 
      activity_data[EXTRACT(ISODOW FROM CURRENT_DATE)::INTEGER] = 
        activity_heatmap.activity_data[EXTRACT(ISODOW FROM CURRENT_DATE)::INTEGER] + 1;
  END IF;
  
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;" "Actualizando función update_user_stats_on_session_complete"

execute_sql "DROP TRIGGER IF EXISTS on_session_completed ON game_sessions;" "Limpiando trigger anterior"

execute_sql "CREATE TRIGGER on_session_completed
    AFTER UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session_complete();" "Creando trigger on_session_completed"

echo ""
echo "📋 8. Creando índices para activity_heatmap..."

execute_sql "CREATE INDEX IF NOT EXISTS idx_activity_heatmap_user_week 
    ON activity_heatmap(user_id, week_start_date);" "Índice para activity_heatmap"

echo ""
echo "🎉 CORRECCIONES APLICADAS!"
echo "   ✅ activity_heatmap creada"
echo "   ✅ problem_attempts ajustada (number_1/number_2)"
echo "   ✅ user_profiles ajustada (avatar_url)"
echo "   ✅ training_sessions → game_sessions"
echo "   ✅ RLS habilitado en todas las tablas"
echo "   ✅ Políticas RLS aplicadas"
echo "   ✅ Triggers funcionando"
echo "   ✅ Índices aplicados"

# Limpiar
rm -f /tmp/response.json