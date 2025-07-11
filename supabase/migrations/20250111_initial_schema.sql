-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Perfiles de usuario (1:1 con auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '👤',
  display_name TEXT,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estadísticas consolidadas por usuario
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Estadísticas de sesión
  sessions_this_week INTEGER DEFAULT 0,
  sessions_last_week INTEGER DEFAULT 0,
  sessions_lifetime INTEGER DEFAULT 0,
  
  -- Estadísticas de problemas
  total_problems_this_week INTEGER DEFAULT 0,
  total_problems_last_week INTEGER DEFAULT 0,
  total_problems_lifetime INTEGER DEFAULT 0,
  
  -- Rendimiento
  average_response_time DECIMAL(4,2) DEFAULT 0,
  last_week_response_time DECIMAL(4,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  consecutive_days INTEGER DEFAULT 0,
  
  -- Nivel y progreso
  current_level INTEGER DEFAULT 1,
  total_hours_invested DECIMAL(6,2) DEFAULT 0,
  next_level_problems INTEGER DEFAULT 50,
  
  -- Metadatos
  last_session_date DATE,
  best_table INTEGER,
  weakest_table INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Sesiones de juego
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Configuración de sesión
  operation_type TEXT NOT NULL CHECK (operation_type IN ('multiplication', 'addition', 'subtraction')),
  selected_tables INTEGER[] DEFAULT '{}',
  number_range TEXT DEFAULT '1-9',
  session_time_limit INTEGER DEFAULT 300,
  
  -- Resultados
  total_problems INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  average_time DECIMAL(6,2) DEFAULT 0,
  session_duration INTEGER DEFAULT 0,
  
  -- Estado
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intentos individuales
CREATE TABLE problem_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Problema
  operation_type TEXT NOT NULL,
  number_1 INTEGER NOT NULL,
  number_2 INTEGER NOT NULL,
  correct_answer INTEGER NOT NULL,
  
  -- Respuesta del usuario
  user_answer INTEGER,
  is_correct BOOLEAN,
  response_time DECIMAL(6,2),
  
  -- Metadatos
  difficulty_level INTEGER DEFAULT 1,
  trick_used TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heatmap de actividad (semanal)
CREATE TABLE activity_heatmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  activity_data INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0], -- 7 días
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

-- =====================================================
-- TRIGGERS Y FUNCIONES
-- =====================================================

-- Auto-crear perfil y estadísticas al registrarse
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear perfil de usuario
  INSERT INTO user_profiles (id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  -- Crear registro de estadísticas inicial
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Actualizar estadísticas al completar sesión
CREATE OR REPLACE FUNCTION update_user_stats_on_session_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_current_week_start DATE;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Calcular inicio de semana actual
    v_current_week_start := date_trunc('week', CURRENT_DATE)::DATE;
    
    -- Actualizar estadísticas
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
    
    -- Actualizar heatmap
    INSERT INTO activity_heatmap (user_id, week_start_date, activity_data)
    VALUES (
      NEW.user_id,
      v_current_week_start,
      ARRAY[0,0,0,0,0,0,0]
    )
    ON CONFLICT (user_id, week_start_date) DO UPDATE
    SET 
      activity_data[EXTRACT(ISODOW FROM CURRENT_DATE)::INTEGER] = 
        activity_heatmap.activity_data[EXTRACT(ISODOW FROM CURRENT_DATE)::INTEGER] + 1,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_session_completed
  AFTER UPDATE ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session_complete();

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES PARA RENDIMIENTO
-- =====================================================

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX idx_problem_attempts_session_id ON problem_attempts(session_id);
CREATE INDEX idx_problem_attempts_user_id ON problem_attempts(user_id);
CREATE INDEX idx_activity_heatmap_user_week ON activity_heatmap(user_id, week_start_date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_heatmap ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can update stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Políticas para game_sessions
CREATE POLICY "Users can view own sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para problem_attempts
CREATE POLICY "Users can view own attempts" ON problem_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON problem_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para activity_heatmap
CREATE POLICY "Users can view own heatmap" ON activity_heatmap
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own heatmap" ON activity_heatmap
  FOR ALL USING (auth.uid() = user_id);