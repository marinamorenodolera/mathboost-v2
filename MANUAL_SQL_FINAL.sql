-- ===================================
-- MATHBOOST SCHEMA CORRECTIONS - MANUAL SQL
-- ===================================
-- Ejecutar en Supabase Dashboard > SQL Editor
-- Corrige las diferencias detectadas

-- 1. CREAR ACTIVITY_HEATMAP (faltante)
CREATE TABLE IF NOT EXISTS activity_heatmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    activity_data INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- 2. VERIFICAR SI GAME_SESSIONS EXISTE, SI NO RENOMBRAR
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_sessions') THEN
        ALTER TABLE training_sessions RENAME TO game_sessions;
    END IF;
END
$$;

-- 3. HABILITAR RLS EN ACTIVITY_HEATMAP
ALTER TABLE activity_heatmap ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS RLS PARA ACTIVITY_HEATMAP
DROP POLICY IF EXISTS "Users can view own heatmap" ON activity_heatmap;
CREATE POLICY "Users can view own heatmap" ON activity_heatmap
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own heatmap" ON activity_heatmap;
CREATE POLICY "Users can manage own heatmap" ON activity_heatmap
    FOR ALL USING (auth.uid() = user_id);

-- 5. CREAR ÍNDICE PARA ACTIVITY_HEATMAP
CREATE INDEX IF NOT EXISTS idx_activity_heatmap_user_week 
    ON activity_heatmap(user_id, week_start_date);

-- 6. ACTUALIZAR TRIGGER PARA INCLUIR ACTIVITY_HEATMAP
CREATE OR REPLACE FUNCTION update_user_stats_on_session_complete()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- 7. ACTUALIZAR TRIGGER EN GAME_SESSIONS
DROP TRIGGER IF EXISTS on_session_completed ON game_sessions;
CREATE TRIGGER on_session_completed
    AFTER UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session_complete();

-- 8. VERIFICACIÓN FINAL
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'user_profiles' THEN '✅ Perfiles de usuario'
    WHEN table_name = 'user_stats' THEN '✅ Estadísticas de usuario'
    WHEN table_name = 'game_sessions' THEN '✅ Sesiones de juego'
    WHEN table_name = 'problem_attempts' THEN '✅ Intentos de problemas'
    WHEN table_name = 'activity_heatmap' THEN '✅ Heatmap de actividad'
    ELSE 'Tabla desconocida'
  END as descripcion
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'user_stats', 'game_sessions', 'problem_attempts', 'activity_heatmap')
ORDER BY table_name;