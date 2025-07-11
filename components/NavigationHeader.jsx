import React from 'react';
import { ArrowLeft, Clock, Target, BarChart3, Lightbulb, User, X } from 'lucide-react';
import { Body } from './Typography';
import useHapticFeedback from './hooks/useHapticFeedback';

const NavigationHeader = ({ 
  showBack = false, 
  onBack = () => {}, 
  gameMode = 'welcome',
  setGameMode = () => {},
  user = null,
  setShowUserSelection = () => {},
  stats = null,
  formatSessionTime = () => '0:00'
}) => {
  const { select } = useHapticFeedback();
  const isPlaying = gameMode === 'playing' || gameMode === 'tricksPlay';
  
  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-white/95 backdrop-blur-lg safe-area-top">
      <div className="h-14 flex items-center justify-between px-4 sm:px-5 lg:px-6">
        
        {/* Lado izquierdo */}
        <div className="flex items-center gap-4">
          {showBack && !isPlaying && (
            <button
              onClick={() => { select(); onBack(); }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
              aria-label="Volver"
            >
              <ArrowLeft size={16} className="text-gray-600" />
            </button>
          )}
          
          {/* Stats durante el juego */}
          {isPlaying && stats && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/80 border border-gray-200 shadow-sm h-10">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-800">
                  {formatSessionTime(stats.sessionDuration)}
                </span>
                <span className="text-xs text-gray-500">/ 5:00</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Target size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-800">
                  {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                </span>
              </div>
              {stats.streak > 0 && (
                <>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔥</span>
                    <span className="text-sm font-medium text-gray-800">{stats.streak}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Lado derecho */}
        <div className="flex items-center gap-3">
          {/* Usuario actual - solo mostrar en setup, NO en playing */}
          {user && gameMode === 'setup' && (
            <button
              onClick={() => { select(); setShowUserSelection(true); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
              aria-label="Cambiar usuario"
            >
              <span className="text-lg">{user.avatar}</span>
              <Body className="hidden sm:inline text-sm text-gray-700 capitalize font-medium">
                {user.name}
              </Body>
            </button>
          )}

          {/* Navegación contextual - solo cuando NO está jugando */}
          {!isPlaying && (
            <div className="flex items-center gap-2">
              {/* En welcome: solo estadísticas y trucos */}
              {gameMode === 'welcome' && (
                <>
                  <button
                    onClick={() => { select(); setGameMode('stats'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Estadísticas"
                  >
                    <BarChart3 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => { select(); setGameMode('tricks'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Trucos"
                  >
                    <Lightbulb size={16} className="text-gray-600" />
                  </button>
                </>
              )}
              
              {/* En stats: trucos y perfil */}
              {gameMode === 'stats' && (
                <>
                  <button
                    onClick={() => { select(); setGameMode('tricks'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Trucos"
                  >
                    <Lightbulb size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => { select(); setGameMode('welcome'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Perfil"
                  >
                    <User size={16} className="text-gray-600" />
                  </button>
                </>
              )}
              
              {/* En tricks: estadísticas y perfil */}
              {gameMode === 'tricks' && (
                <>
                  <button
                    onClick={() => { select(); setGameMode('stats'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Estadísticas"
                  >
                    <BarChart3 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => { select(); setGameMode('welcome'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                    aria-label="Perfil"
                  >
                    <User size={16} className="text-gray-600" />
                  </button>
                </>
              )}
              
              {/* En setup: solo perfil (para salir) */}
              {gameMode === 'setup' && (
                <button
                  onClick={() => { select(); setGameMode('welcome'); }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-200 transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95 active:bg-blue-50 no-select shadow-sm"
                  aria-label="Perfil"
                >
                  <User size={16} className="text-gray-600" />
                </button>
              )}
            </div>
          )}
          
          {/* Botón salir durante juego */}
          {isPlaying && (
            <button
              onClick={() => { select(); setGameMode('welcome'); }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 transition-all duration-150 hover:bg-red-100 hover:shadow-lg active:scale-95 active:bg-red-200 no-select shadow-sm"
              aria-label="Salir"
            >
              <X size={16} className="text-red-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;