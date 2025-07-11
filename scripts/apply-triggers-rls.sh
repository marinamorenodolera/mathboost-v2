#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkxODI4NSwiZXhwIjoyMDUxNDk0Mjg1fQ.8M8YYzwKEgB3l1wgQpjRzKZJRDZABMnApZjhWGWO1r8"

echo "🔧 APLICANDO TRIGGERS, FUNCIONES Y RLS"
echo "===================================="

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

# 1. Crear funciones y triggers
echo "📋 1. Creando funciones..."

execute_sql "CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS \$\$
BEGIN
  INSERT INTO user_profiles (id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;" "Creando función create_user_profile"

execute_sql "CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();" "Creando trigger on_auth_user_created"

execute_sql "CREATE OR REPLACE FUNCTION update_user_stats_on_session_complete()
RETURNS TRIGGER AS \$\$
DECLARE
  v_current_week_start DATE;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    v_current_week_start := date_trunc('week', CURRENT_DATE)::DATE;
    
    UPDATE user_stats 
    SET 
      sessions_this_week = sessions_this_week + 1,
      sessions_lifetime = sessions_lifetime + 1,
      total_problems_this_week = total_problems_this_week + NEW.total_problems,
      total_problems_lifetime = total_problems_lifetime + NEW.total_problems,
      total_hours_invested = total_hours_invested + (NEW.session_duration / 3600.0),
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
\$\$ LANGUAGE plpgsql;" "Creando función update_user_stats_on_session_complete"

execute_sql "CREATE TRIGGER on_session_completed
  AFTER UPDATE ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session_complete();" "Creando trigger on_session_completed"

execute_sql "CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;" "Creando función update_updated_at_column"

execute_sql "CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();" "Creando trigger para user_profiles"

execute_sql "CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();" "Creando trigger para user_stats"

# 2. Crear índices
echo ""
echo "📋 2. Creando índices..."

execute_sql "CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);" "Índice user_stats.user_id"
execute_sql "CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);" "Índice game_sessions.user_id"
execute_sql "CREATE INDEX idx_game_sessions_status ON game_sessions(status);" "Índice game_sessions.status"
execute_sql "CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);" "Índice game_sessions.created_at"
execute_sql "CREATE INDEX idx_problem_attempts_session_id ON problem_attempts(session_id);" "Índice problem_attempts.session_id"
execute_sql "CREATE INDEX idx_problem_attempts_user_id ON problem_attempts(user_id);" "Índice problem_attempts.user_id"
execute_sql "CREATE INDEX idx_activity_heatmap_user_week ON activity_heatmap(user_id, week_start_date);" "Índice activity_heatmap"

# 3. Habilitar RLS
echo ""
echo "📋 3. Habilitando Row Level Security..."

execute_sql "ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;" "RLS en user_profiles"
execute_sql "ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;" "RLS en user_stats"
execute_sql "ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;" "RLS en game_sessions"
execute_sql "ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;" "RLS en problem_attempts"
execute_sql "ALTER TABLE activity_heatmap ENABLE ROW LEVEL SECURITY;" "RLS en activity_heatmap"

# 4. Crear políticas RLS
echo ""
echo "📋 4. Creando políticas RLS..."

# user_profiles
execute_sql "CREATE POLICY \"Users can view own profile\" ON user_profiles
  FOR SELECT USING (auth.uid() = id);" "Política SELECT para user_profiles"

execute_sql "CREATE POLICY \"Users can update own profile\" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);" "Política UPDATE para user_profiles"

# user_stats
execute_sql "CREATE POLICY \"Users can view own stats\" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);" "Política SELECT para user_stats"

execute_sql "CREATE POLICY \"System can insert stats\" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);" "Política INSERT para user_stats"

execute_sql "CREATE POLICY \"System can update stats\" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);" "Política UPDATE para user_stats"

# game_sessions
execute_sql "CREATE POLICY \"Users can view own sessions\" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);" "Política SELECT para game_sessions"

execute_sql "CREATE POLICY \"Users can create own sessions\" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);" "Política INSERT para game_sessions"

execute_sql "CREATE POLICY \"Users can update own sessions\" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);" "Política UPDATE para game_sessions"

# problem_attempts
execute_sql "CREATE POLICY \"Users can view own attempts\" ON problem_attempts
  FOR SELECT USING (auth.uid() = user_id);" "Política SELECT para problem_attempts"

execute_sql "CREATE POLICY \"Users can create own attempts\" ON problem_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);" "Política INSERT para problem_attempts"

# activity_heatmap
execute_sql "CREATE POLICY \"Users can view own heatmap\" ON activity_heatmap
  FOR SELECT USING (auth.uid() = user_id);" "Política SELECT para activity_heatmap"

execute_sql "CREATE POLICY \"Users can manage own heatmap\" ON activity_heatmap
  FOR ALL USING (auth.uid() = user_id);" "Política ALL para activity_heatmap"

echo ""
echo "🎉 CONFIGURACIÓN COMPLETA!"
echo "   ✅ Funciones creadas"
echo "   ✅ Triggers configurados"
echo "   ✅ Índices aplicados"
echo "   ✅ RLS habilitado"
echo "   ✅ Políticas configuradas"
echo ""
echo "🚀 Base de datos MathBoost lista para autenticación!"

# Limpiar archivos temporales
rm -f /tmp/supabase_response.json