import React, { useState, useEffect, useCallback } from 'react';
import NavigationHeader from './NavigationHeader';
import GameLayout from './GameLayout';
import MobileKeyboard from './MobileKeyboard';
import WelcomeScreen from './screens/WelcomeScreen';
import GameScreen from './screens/GameScreen';
import SetupScreen from './screens/SetupScreen';
import useSwipeGestures from './hooks/useSwipeGestures';
import ViewportHandler from './ViewportHandler';
import SwipeIndicator from './SwipeIndicator';
import PerformanceOptimizer from './PerformanceOptimizer';
import LoadingSpinner from './LoadingSpinner';

const MathBoostNew = () => {
  // Estados principales
  const [gameMode, setGameMode] = useState('welcome');
  const [setupStep, setSetupStep] = useState(1);
  const [operation, setOperation] = useState('multiplication');
  const [selectedTables, setSelectedTables] = useState([2, 3, 4, 5]);
  const [numberRange, setNumberRange] = useState('1-9');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [showSparkle, setShowSparkle] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [currentUser, setCurrentUser] = useState('marina');
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Stats del juego
  const [stats, setStats] = useState({
    correct: 0,
    total: 0,
    averageTime: 0,
    streak: 0,
    sessionDuration: 0,
    errors: []
  });

  // Usuario demo (simplificado)
  const [users] = useState({
    marina: {
      name: 'marina',
      avatar: '👩‍💻',
      currentLevel: 1,
      totalProblemsThisWeek: 42,
      averageResponseTime: 3.5,
      currentStreak: 5,
      bestStreak: 12,
      consecutiveDays: 3,
      totalHoursInvested: 2.5
    }
  });

  const user = users[currentUser];

  // Detectar tamaño de pantalla
  const [screenSize, setScreenSize] = useState('mobile');
  
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setScreenSize('desktop');
      } else if (window.innerWidth >= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Mostrar hint de swipe en primera visita
  useEffect(() => {
    if (gameMode === 'welcome' && screenSize === 'mobile') {
      const hasSeenHint = localStorage.getItem('swipeHintSeen');
      if (!hasSeenHint) {
        const timer = setTimeout(() => {
          setShowSwipeHint(true);
          localStorage.setItem('swipeHintSeen', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameMode, screenSize]);

  // Timer de sesión
  useEffect(() => {
    let interval;
    if ((gameMode === 'playing' || gameMode === 'tricksPlay') && !sessionEnded && sessionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setStats(prev => ({ ...prev, sessionDuration: elapsed }));
        
        if (elapsed >= 300) { // 5 minutos
          setSessionEnded(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, sessionEnded, sessionStartTime]);

  // Manejo del teclado físico
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((gameMode === 'playing' || gameMode === 'tricksPlay') && !showFeedback && !sessionEnded) {
        if (e.key >= '0' && e.key <= '9') {
          setUserAnswer(prev => prev + e.key);
        } else if (e.key === 'Backspace') {
          setUserAnswer(prev => prev.slice(0, -1));
        } else if (e.key === 'Enter' && userAnswer) {
          checkAnswer(userAnswer);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameMode, showFeedback, sessionEnded, userAnswer]);

  // Generar problema
  const generateProblem = useCallback(() => {
    let num1, num2;
    
    if (operation === 'multiplication') {
      num1 = selectedTables[Math.floor(Math.random() * selectedTables.length)];
      num2 = Math.floor(Math.random() * 9) + 1;
    } else {
      const [min, max] = numberRange.split('-').map(Number);
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let correctAnswer;
    switch(operation) {
      case 'multiplication':
        correctAnswer = num1 * num2;
        break;
      case 'addition':
        correctAnswer = num1 + num2;
        break;
      case 'subtraction':
        if (num1 < num2) [num1, num2] = [num2, num1];
        correctAnswer = num1 - num2;
        break;
      default:
        correctAnswer = num1 * num2;
    }
    
    return { num1, num2, correctAnswer, operation };
  }, [operation, selectedTables, numberRange]);

  // Iniciar juego con loading
  const startGame = useCallback(() => {
    setIsLoading(true);
    setLoadingMessage('Preparando ejercicios...');
    
    setTimeout(() => {
      setGameMode('playing');
      setUserAnswer('');
      setShowFeedback(false);
      setSessionStartTime(Date.now());
      setSessionEnded(false);
      setStats({ correct: 0, total: 0, averageTime: 0, streak: 0, sessionDuration: 0, errors: [] });
      const problem = generateProblem();
      setCurrentProblem(problem);
      setStartTime(Date.now());
      setIsLoading(false);
    }, 800);
  }, [generateProblem]);

  // Verificar respuesta
  const checkAnswer = useCallback((answer) => {
    if (!currentProblem || !answer || sessionEnded) return;
    
    const responseTime = Date.now() - startTime;
    const correct = parseInt(answer) === currentProblem.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
    
    setStats(prev => {
      const newTotal = prev.total + 1;
      const newCorrect = prev.correct + (correct ? 1 : 0);
      const newStreak = correct ? prev.streak + 1 : 0;
      const newAvgTime = ((prev.averageTime * prev.total) + responseTime) / newTotal;
      
      return {
        ...prev,
        correct: newCorrect,
        total: newTotal,
        averageTime: newAvgTime,
        streak: newStreak
      };
    });
    
    setTimeout(() => {
      if (!sessionEnded) {
        const newProblem = generateProblem();
        setCurrentProblem(newProblem);
        setUserAnswer('');
        setShowFeedback(false);
        setIsCorrect(null);
        setStartTime(Date.now());
      }
    }, correct ? 800 : 1200);
  }, [currentProblem, sessionEnded, startTime, generateProblem]);

  // Auto-confirmación cuando se completa el número exacto de dígitos
  useEffect(() => {
    if (userAnswer && currentProblem && !showFeedback) {
      const expectedDigits = currentProblem.correctAnswer.toString().length;
      if (userAnswer.length === expectedDigits) {
        // Delay muy rápido para respuestas inmediatas
        const delay = expectedDigits === 1 ? 100 : 200;
        const timer = setTimeout(() => {
          // Verificar que la respuesta no haya cambiado durante el delay
          if (userAnswer.length === expectedDigits && !showFeedback) {
            checkAnswer(userAnswer);
          }
        }, delay);
        
        // Cleanup: cancelar timer si el efecto se ejecuta de nuevo
        return () => clearTimeout(timer);
      }
    }
  }, [userAnswer, currentProblem, showFeedback, checkAnswer]);

  // Funciones auxiliares
  const getOperationSymbol = (op) => {
    switch(op) {
      case 'multiplication': return '×';
      case 'addition': return '+';
      case 'subtraction': return '−';
      default: return '×';
    }
  };

  const getExpectedDigits = (num) => num.toString().length;

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestos de navegación con loading
  const handleSwipeLeft = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoadingMessage('Navegando...');
    
    setTimeout(() => {
      if (gameMode === 'welcome') {
        setGameMode('stats');
      } else if (gameMode === 'stats') {
        setGameMode('tricks');
      }
      setIsLoading(false);
    }, 300);
  }, [gameMode, isLoading]);

  const handleSwipeRight = useCallback(() => {
    if (gameMode === 'tricks') {
      setGameMode('stats');
    } else if (gameMode === 'stats') {
      setGameMode('welcome');
    } else if (gameMode === 'setup') {
      setGameMode('welcome');
    }
  }, [gameMode]);

  const handleSwipeUp = useCallback(() => {
    if (gameMode === 'welcome') {
      setGameMode('setup');
    }
  }, [gameMode]);

  const { swipeHandlers } = useSwipeGestures(
    handleSwipeLeft,
    handleSwipeRight,
    handleSwipeUp,
    null, // No swipe down por ahora
    80 // Threshold más alto para evitar activación accidental
  );

  // Manejo del teclado móvil
  const handleNumberClick = (num) => {
    setUserAnswer(prev => prev + num);
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setUserAnswer('');
  };

  // Renderizar pantalla según el modo
  const renderScreen = () => {
    switch(gameMode) {
      case 'welcome':
        return (
          <WelcomeScreen 
            user={user} 
            setGameMode={setGameMode}
            setShowUserSelection={setShowUserSelection}
          />
        );
      
      case 'setup':
        return (
          <SetupScreen
            setupStep={setupStep}
            setSetupStep={setSetupStep}
            operation={operation}
            setOperation={setOperation}
            selectedTables={selectedTables}
            setSelectedTables={setSelectedTables}
            numberRange={numberRange}
            setNumberRange={setNumberRange}
            startGame={startGame}
          />
        );
      
      case 'playing':
        return (
          <GameScreen
            currentProblem={currentProblem}
            userAnswer={userAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            showSparkle={showSparkle}
            getOperationSymbol={getOperationSymbol}
            getExpectedDigits={getExpectedDigits}
            screenSize={screenSize}
          />
        );
        
      case 'stats':
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-light text-gray-800 mb-4">Estadísticas</h2>
              <p className="text-gray-600 mb-6">Próximamente podrás ver tu progreso detallado, estadísticas de velocidad y análisis de rendimiento.</p>
              <button
                onClick={() => setGameMode('welcome')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        );
        
      case 'tricks':
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">💡</div>
              <h2 className="text-2xl font-light text-gray-800 mb-4">Trucos y Consejos</h2>
              <p className="text-gray-600 mb-6">Próximamente encontrarás trucos matemáticos, técnicas de cálculo mental y estrategias para mejorar tu velocidad.</p>
              <button
                onClick={() => setGameMode('welcome')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <ViewportHandler />
      <PerformanceOptimizer />
      <NavigationHeader
        showBack={gameMode === 'setup'}
        onBack={() => setGameMode('welcome')}
        gameMode={gameMode}
        setGameMode={setGameMode}
        user={user}
        setShowUserSelection={setShowUserSelection}
        stats={stats}
        formatSessionTime={formatSessionTime}
      />
      
      <GameLayout 
        showKeyboard={screenSize === 'mobile' && (gameMode === 'playing' || gameMode === 'tricksPlay')}
        {...(gameMode !== 'playing' && gameMode !== 'tricksPlay' ? swipeHandlers : {})}
      >
        {renderScreen()}
      </GameLayout>
      
      {screenSize === 'mobile' && (gameMode === 'playing' || gameMode === 'tricksPlay') && !showFeedback && !sessionEnded && (
        <MobileKeyboard
          userAnswer={userAnswer}
          onNumberClick={handleNumberClick}
          onBackspace={handleBackspace}
          onClear={handleClear}
          disabled={showFeedback || sessionEnded}
        />
      )}
      
      <SwipeIndicator 
        direction="horizontal" 
        show={showSwipeHint && screenSize === 'mobile'} 
      />
      
      <LoadingSpinner 
        show={isLoading} 
        message={loadingMessage} 
      />
    </>
  );
};

export default MathBoostNew;