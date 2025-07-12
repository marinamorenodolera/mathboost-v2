'use client';
import React from 'react';
import { Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStats } from '../../hooks/useUserStats';

const WelcomeScreen = ({ setGameMode }) => {
  const { user, profile, signOut } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  
  // Guard contra valores null/undefined
  if (!user) return null;
  
  // Usar profile por defecto si no existe
  const safeProfile = profile || {
    id: user.id,
    username: user.email?.split('@')[0] || 'usuario',
    display_name: 'Usuario',
    avatar_url: '👤',
    current_level: 1
  };

  const levelSystem = [
    { level: 1, name: 'Aprendiz Numérico', category: 'Aprendiz', weeklyProblemsMin: 50, weeklyProblemsMax: 100, speedTarget: 5.0, emoji: '🌱' },
    { level: 2, name: 'Explorador Matemático', category: 'Aprendiz', weeklyProblemsMin: 75, weeklyProblemsMax: 125, speedTarget: 4.5, emoji: '🔍' },
    { level: 3, name: 'Estudiante Dedicado', category: 'Aprendiz', weeklyProblemsMin: 100, weeklyProblemsMax: 150, speedTarget: 4.0, emoji: '📚' },
    { level: 4, name: 'Calculador Emergente', category: 'Calculador', weeklyProblemsMin: 150, weeklyProblemsMax: 250, speedTarget: 3.5, emoji: '⚡' },
    { level: 5, name: 'Procesador Rápido', category: 'Calculador', weeklyProblemsMin: 200, weeklyProblemsMax: 300, speedTarget: 3.2, emoji: '🚀' },
    { level: 6, name: 'Computador Mental', category: 'Calculador', weeklyProblemsMin: 250, weeklyProblemsMax: 400, speedTarget: 3.0, emoji: '🧠' },
    { level: 7, name: 'Matemático Líquido', category: 'Matemático', weeklyProblemsMin: 350, weeklyProblemsMax: 500, speedTarget: 2.8, emoji: '🌊' },
    { level: 8, name: 'Artista Numérico', category: 'Matemático', weeklyProblemsMin: 400, weeklyProblemsMax: 600, speedTarget: 2.5, emoji: '🎨' },
    { level: 9, name: 'Maestro de Patrones', category: 'Matemático', weeklyProblemsMin: 500, weeklyProblemsMax: 750, speedTarget: 2.3, emoji: '🔮' },
    { level: 10, name: 'Experto Intuitivo', category: 'Experto', weeklyProblemsMin: 600, weeklyProblemsMax: 900, speedTarget: 2.1, emoji: '💎' },
    { level: 11, name: 'Virtuoso del Cálculo', category: 'Experto', weeklyProblemsMin: 800, weeklyProblemsMax: 1100, speedTarget: 2.0, emoji: '🎭' },
    { level: 12, name: 'Ninja Matemático', category: 'Experto', weeklyProblemsMin: 900, weeklyProblemsMax: 1200, speedTarget: 1.8, emoji: '🥷' },
    { level: 13, name: 'Maestro Cuántico', category: 'Maestro', weeklyProblemsMin: 1000, weeklyProblemsMax: 1400, speedTarget: 1.6, emoji: '⚛️' },
    { level: 14, name: 'Genio Computacional', category: 'Maestro', weeklyProblemsMin: 1200, weeklyProblemsMax: 1600, speedTarget: 1.4, emoji: '🧬' },
    { level: 15, name: 'Dios Matemático', category: 'Maestro', weeklyProblemsMin: 1500, weeklyProblemsMax: 2000, speedTarget: 1.2, emoji: '🌟' }
  ];

  const getUserLevelName = (profile) => {
    const level = levelSystem.find(l => l.level === (profile?.current_level || 1));
    return level ? level.name : 'Aprendiz Numérico';
  };

  const getWeeklyProblemsGoal = (profile) => {
    const level = levelSystem.find(l => l.level === (profile?.current_level || 1));
    return level ? level.weeklyProblemsMax : 100;
  };

  const getWeeklySpeedGoal = (profile) => {
    const level = levelSystem.find(l => l.level === (profile?.current_level || 1));
    return level ? level.speedTarget : 5.0;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 px-8 pt-8 pb-12 max-w-md mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Título principal - muy prominente */}
          <h1 className="text-4xl font-light text-gray-800 mb-6" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            mathboost
          </h1>
          
          {/* Avatar sin círculo */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto flex items-center justify-center">
              <span className="text-5xl animate-bounce">{safeProfile.avatar_url || '👤'}</span>
            </div>
          </div>
          
          {/* Username y nivel */}
          <p className="text-lg text-gray-800 font-medium mb-1" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            {safeProfile.username || safeProfile.display_name || 'Usuario'}
          </p>
          <p className="text-base text-gray-600 mb-2" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            {getUserLevelName(safeProfile)} • Nivel {safeProfile.current_level || 1}
          </p>
        </div>

        {/* Botones principales con spacing compacto */}
        <div className="space-y-3 mb-4 animate-slide-up">
          {/* Botón principal con degradado */}
          <button
            onClick={() => setGameMode('setup')}
            className="w-full px-6 py-3.5 text-gray-800 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)'
            }}
          >
            <span className="inline-block mr-2 text-lg">🚀</span>
            comenzar entrenamiento
          </button>
          
          {/* Botón secundario más discreto */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <span className="inline-block mr-2">👋</span>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Cards de progreso con spacing reducido */}
        <div className="space-y-3 mb-6">
          {/* Problemas semanales */}
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 group transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer relative">
            {/* Indicador de interactividad */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-200">📊</div>
                <h4 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                  Problemas semanales
                </h4>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                  {stats?.total_problems_this_week || 0}
                </div>
                <div className="text-sm text-gray-600">
                  / {getWeeklyProblemsGoal(safeProfile)}
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, ((stats?.total_problems_this_week || 0) / getWeeklyProblemsGoal(safeProfile)) * 100)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-center text-gray-600 mt-2">
                {getWeeklyProblemsGoal(safeProfile) - (stats?.total_problems_this_week || 0) > 0 
                  ? `${getWeeklyProblemsGoal(safeProfile) - (stats?.total_problems_this_week || 0)} para completar meta`
                  : '¡Meta semanal completada! 🎉'
                }
              </div>
            </div>
          </div>

          {/* Velocidad objetivo */}
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 group transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer relative animate-scale-in" style={{ animationDelay: '100ms' }}>
            {/* Indicador de interactividad */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h4 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                Velocidad objetivo
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                  {parseFloat(stats?.average_response_time || 0).toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">
                  / {getWeeklySpeedGoal(safeProfile)}s
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ 
                    width: (stats?.average_response_time || 0) > 0 
                      ? `${Math.min(100, Math.max(0, (getWeeklySpeedGoal(safeProfile) - (stats?.average_response_time || 0)) / getWeeklySpeedGoal(safeProfile) * 100))}%`
                      : '0%'
                  }}
                />
              </div>
              <div className="text-xs text-center text-gray-600 mt-2">
                {(stats?.average_response_time || 0) > 0 && (stats?.average_response_time || 0) <= getWeeklySpeedGoal(safeProfile)
                  ? '¡Objetivo de velocidad alcanzado! 🎯'
                  : (stats?.average_response_time || 0) > 0
                    ? `Mejora ${((stats?.average_response_time || 0) - getWeeklySpeedGoal(safeProfile)).toFixed(1)}s para meta`
                    : 'Comienza a entrenar para ver tu progreso'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Stats adicionales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="p-4 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>{stats?.current_streak || 0}</div>
            <div className="text-xs text-gray-600">racha actual</div>
          </div>
          <div className="p-4 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>{stats?.best_streak || 0}</div>
            <div className="text-xs text-gray-600">mejor racha</div>
          </div>
          <div className="p-4 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>{stats?.sessions_this_week || 0}</div>
            <div className="text-xs text-gray-600">sesiones semanales</div>
          </div>
          <div className="p-4 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>{(stats?.total_hours_invested || 0).toFixed(2)}</div>
            <div className="text-xs text-gray-600">horas totales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;