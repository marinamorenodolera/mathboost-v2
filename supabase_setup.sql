-- SUPABASE SETUP COMPLETO PARA MATHBOOST
-- Ejecutar este script en Supabase SQL Editor

-- 1. TABLA user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT DEFAULT '👤',
    current_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA user_stats
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sessions_this_week INTEGER DEFAULT 0,
    sessions_last_week INTEGER DEFAULT 0,
    sessions_lifetime INTEGER DEFAULT 0,
    total_problems_this_week INTEGER DEFAULT 0,
    total_problems_last_week INTEGER DEFAULT 0,
    total_problems_lifetime INTEGER DEFAULT 0,
    average_response_time DECIMAL DEFAULT 0,
    last_week_response_time DECIMAL DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    consecutive_days INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    total_hours_invested DECIMAL DEFAULT 0,
    next_level_problems INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- 3. TABLA game_sessions
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    operation_type TEXT NOT NULL,
    settings JSONB DEFAULT '{}',
    status TEXT DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_problems INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    incorrect_answers INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL DEFAULT 0,
    average_response_time DECIMAL DEFAULT 0,
    session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA problem_attempts
CREATE TABLE IF NOT EXISTS public.problem_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    number_1 INTEGER NOT NULL,
    number_2 INTEGER NOT NULL,
    operation TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    user_answer INTEGER NOT NULL,
    response_time INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_attempts ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES PARA user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. POLICIES PARA user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. POLICIES PARA game_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.game_sessions;

CREATE POLICY "Users can view own sessions" ON public.game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. POLICIES PARA problem_attempts
DROP POLICY IF EXISTS "Users can view own attempts" ON public.problem_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.problem_attempts;

CREATE POLICY "Users can view own attempts" ON public.problem_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.problem_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. INDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_attempts_session_id ON public.problem_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_problem_attempts_user_id ON public.problem_attempts(user_id);

-- 11. FUNCIÓN PARA ACTUALIZAR user_stats AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar cuando la sesión se completa
    IF NEW.status = 'completed' AND OLD.status = 'in_progress' THEN
        -- Actualizar o insertar stats del usuario
        INSERT INTO public.user_stats (
            user_id,
            sessions_lifetime,
            total_problems_lifetime,
            sessions_this_week,
            total_problems_this_week
        ) VALUES (
            NEW.user_id,
            1,
            NEW.total_problems,
            1,
            NEW.total_problems
        )
        ON CONFLICT (user_id) DO UPDATE SET
            sessions_lifetime = user_stats.sessions_lifetime + 1,
            total_problems_lifetime = user_stats.total_problems_lifetime + NEW.total_problems,
            sessions_this_week = user_stats.sessions_this_week + 1,
            total_problems_this_week = user_stats.total_problems_this_week + NEW.total_problems,
            average_response_time = (
                (user_stats.average_response_time * user_stats.sessions_lifetime + NEW.average_response_time) / 
                (user_stats.sessions_lifetime + 1)
            ),
            updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. TRIGGER PARA ACTUALIZAR STATS AUTOMÁTICAMENTE
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.game_sessions;
CREATE TRIGGER trigger_update_user_stats
    AFTER UPDATE ON public.game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_after_session();

-- 13. FUNCIÓN PARA CREAR PERFIL Y STATS AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario')
    );
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ✅ SETUP COMPLETO
SELECT 'Supabase setup completado exitosamente!' AS status;