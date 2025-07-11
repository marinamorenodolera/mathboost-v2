import React, { useEffect, useRef } from 'react';

const GameScreen = ({ 
  currentProblem, 
  userAnswer, 
  showFeedback, 
  isCorrect, 
  showSparkle,
  getOperationSymbol,
  getExpectedDigits,
  screenSize 
}) => {
  const hiddenInputRef = useRef(null);
  
  // Forzar teclado numérico en móviles
  useEffect(() => {
    if (screenSize === 'mobile' && !showFeedback && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [currentProblem, showFeedback, screenSize]);
  
  if (!currentProblem) return null;

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl text-center">
        {/* Problema */}
        <div className="mb-20">
          <div className="text-6xl sm:text-7xl lg:text-8xl font-light flex items-center justify-center gap-6 animate-pulse text-gray-800 mb-12" 
               style={{ 
                 fontFamily: 'Georgia, serif',
                 animationDuration: '3s',
                 animationIterationCount: '1',
                 textShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
               }}>
            <span>{currentProblem.num1}</span>
            <span>{getOperationSymbol(currentProblem.operation)}</span>
            <span>{currentProblem.num2}</span>
          </div>
          <div className="mathboost-divider" />
        </div>
        
        {/* Respuesta */}
        <div className="relative mb-20">
          {/* Sparkle effect */}
          {showSparkle && (
            <div className="absolute top-4 right-4 pointer-events-none transition-all duration-500 opacity-100 scale-100">
              <div className="text-4xl animate-bounce">✨</div>
            </div>
          )}
          
          <div 
            className={`
              text-9xl font-light min-h-[160px] flex items-center justify-center
              transition-all duration-500
              ${showFeedback 
                ? isCorrect 
                  ? 'scale-110 text-green-600' 
                  : 'scale-90 text-red-600'
                : 'scale-100 text-gray-800'
              }
            `}
            style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: showFeedback ? `0 8px 32px ${isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` : 'none'
            }}
          >
            {showFeedback 
              ? currentProblem.correctAnswer
              : userAnswer || (
                <span className="opacity-30 pb-3 animate-pulse" style={{ borderBottom: '3px solid rgba(0,0,0,0.1)' }}>
                  {getExpectedDigits(currentProblem.correctAnswer) === 1 ? '_' : '__'}
                </span>
              )}
          </div>
          
          {/* Barra de progreso de respuesta */}
          {userAnswer && !showFeedback && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div 
                className="h-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-green-400"
                style={{ 
                  width: `${(userAnswer.length / getExpectedDigits(currentProblem.correctAnswer)) * 100}%`
                }}
              />
            </div>
          )}
          
          {/* Feedback de error */}
          {showFeedback && !isCorrect && userAnswer && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-gray-600" 
                 style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              escribiste: <span className="font-bold" style={{ fontFamily: 'Georgia, serif' }}>{userAnswer}</span>
            </div>
          )}
        </div>

        {/* Input invisible para forzar teclado numérico */}
        {screenSize === 'mobile' && !showFeedback && (
          <input
            ref={hiddenInputRef}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            className="sr-only opacity-0 absolute -top-full"
            tabIndex={-1}
            autoComplete="off"
            readOnly
            style={{ pointerEvents: 'none' }}
          />
        )}
        
        {/* Instrucción */}
        <div className="text-lg font-light text-gray-600" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          {screenSize === 'mobile' ? 'usa el teclado abajo' : 'escribe tu respuesta'}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;