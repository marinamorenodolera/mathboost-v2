import React from 'react';
import useHapticFeedback from './hooks/useHapticFeedback';
import { TouchFeedback, NumberTransition } from './MicroAnimations';

const MobileKeyboard = ({ 
  userAnswer = '', 
  onNumberClick = () => {}, 
  onBackspace = () => {}, 
  onClear = () => {},
  disabled = false 
}) => {
  const { light, medium, select } = useHapticFeedback();
  
  const handleNumberClick = (num) => {
    if (!disabled) {
      light(); // Haptic feedback ligero para números
      onNumberClick(num);
    }
  };

  const handleActionClick = (action) => {
    if (!disabled) {
      medium(); // Haptic feedback medio para acciones
      action();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-black/5 safe-area-bottom sm:hidden">
      <div className="p-4 space-y-3">
        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
            <TouchFeedback
              key={num}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
                <button
                  onClick={() => handleNumberClick(num)}
                  disabled={disabled}
                  className={`
                    w-full h-14 text-2xl font-medium rounded-xl transition-all duration-100 hover:scale-105 active:scale-95 number-transition
                    ${disabled 
                      ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' 
                      : 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 active:bg-blue-50 text-gray-800'
                    }
                    no-select touch-manipulation
                  `}
                  style={{
                    fontFamily: 'Georgia, serif',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    touchAction: 'manipulation'
                  }}
                  aria-label={`Número ${num}`}
                >
                  <NumberTransition>{num}</NumberTransition>
                </button>
              </TouchFeedback>
          ))}
        </div>
        
        {/* Fila inferior */}
        <div className="grid grid-cols-3 gap-3">
          <TouchFeedback className="animate-scale-in" style={{ animationDelay: '450ms' }}>
              <button
                onClick={() => handleActionClick(onClear)}
                disabled={disabled || !userAnswer}
                className={`
                  w-full h-14 text-lg font-medium rounded-xl transition-all duration-100 hover:scale-105 active:scale-95
                  ${disabled || !userAnswer
                    ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' 
                    : 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 active:bg-red-50 text-gray-600'
                  }
                  no-select touch-manipulation
                `}
                style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
                aria-label="Limpiar"
              >
                C
              </button>
            </TouchFeedback>
          
          <TouchFeedback className="animate-scale-in" style={{ animationDelay: '500ms' }}>
            <button
              onClick={() => handleNumberClick(0)}
              disabled={disabled}
              className={`
                w-full h-14 text-2xl font-medium rounded-xl transition-all duration-100 hover:scale-105 active:scale-95 number-transition
                ${disabled 
                  ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' 
                  : 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 text-gray-800'
                }
                no-select touch-manipulation
              `}
              style={{
                fontFamily: 'Georgia, serif',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label="Número 0"
            >
              <NumberTransition>0</NumberTransition>
            </button>
          </TouchFeedback>
          
          <TouchFeedback className="animate-scale-in" style={{ animationDelay: '550ms' }}>
            <button
              onClick={() => handleActionClick(onBackspace)}
              disabled={disabled || !userAnswer}
              className={`
                w-full h-14 text-lg font-medium rounded-xl transition-all duration-100 hover:scale-105 active:scale-95
                ${disabled || !userAnswer
                  ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' 
                  : 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 active:bg-red-50 text-gray-600'
                }
                no-select touch-manipulation
              `}
              style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label="Borrar"
            >
              ⌫
            </button>
          </TouchFeedback>
        </div>

        {/* Indicador visual de respuesta */}
        {userAnswer && (
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300"
              style={{ 
                width: `${Math.min(100, userAnswer.length * 50)}%` 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileKeyboard;