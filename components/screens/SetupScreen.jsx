import React from 'react';
import { RotateCcw } from 'lucide-react';

const SetupScreen = ({ 
  setupStep, 
  setSetupStep, 
  operation, 
  setOperation, 
  selectedTables, 
  setSelectedTables,
  numberRange,
  setNumberRange,
  startGame 
}) => {
  const operations = [
    { key: 'multiplication', label: 'multiplicación', symbol: '×' },
    { key: 'addition', label: 'suma', symbol: '+' },
    { key: 'subtraction', label: 'resta', symbol: '−' }
  ];

  const numberRanges = [
    { value: '1-9', label: '1-9', description: 'números básicos' },
    { value: '1-20', label: '1-20', description: 'rango medio' },
    { value: '1-50', label: '1-50', description: 'rango amplio' },
    { value: '1-99', label: '1-99', description: 'desafío completo' }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-4 sm:mb-6" 
              style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            configuración
          </h1>
          
          {/* Steps indicator */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setSetupStep(1)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                  setupStep === 1 
                    ? 'bg-blue-50/80 backdrop-blur-lg border border-blue-200/30' 
                    : 'bg-white/70 backdrop-blur-lg hover:bg-blue-50/60 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md border border-white/30 hover:border-blue-200/40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  setupStep === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-sm hidden sm:inline ${
                  setupStep === 1 ? 'text-blue-700 font-medium' : 'text-gray-500'
                }`}>
                  Operación
                </span>
              </button>
              
              <div className="w-8 h-px bg-gray-300" />
              
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                setupStep === 2 ? 'bg-blue-50/80 backdrop-blur-lg border border-blue-200/30' : 'bg-white/70 backdrop-blur-lg border border-white/30'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  setupStep === 2 ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm hidden sm:inline ${
                  setupStep === 2 ? 'text-blue-700 font-medium' : 'text-gray-500'
                }`}>
                  {operation === 'multiplication' ? 'Tablas' : 'Rango'}
                </span>
              </div>
            </div>
            
            {/* Step descriptions */}
            <div className="flex items-center justify-center gap-8 text-xs text-gray-400">
              <div className={`text-center transition-all ${setupStep === 1 ? 'text-blue-600 font-medium' : ''}`}>
                {setupStep === 1 ? 'paso actual' : 'clic para volver'}
              </div>
              <div className={`text-center transition-all ${setupStep === 2 ? 'text-blue-600 font-medium' : ''}`}>
                {setupStep === 2 ? 'paso actual' : 'siguiente paso'}
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Operation Selection */}
        {setupStep === 1 && (
          <div className="animate-fade-in">
            <p className="text-center text-base sm:text-lg font-light mb-8 sm:mb-12 text-gray-600">
              ¿qué operación practicarás?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {operations.map(op => (
                <button
                  key={op.key}
                  onClick={() => {
                    setOperation(op.key);
                    setSetupStep(2);
                  }}
                  className={`
                    touch-target-lg p-8 sm:p-12 text-center rounded-2xl
                    transition-all duration-300 hover:scale-105 active:scale-95 no-select
                    ${operation === op.key 
                      ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl border border-blue-400/30 backdrop-blur-xl' 
                      : 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 text-slate-800 hover:border-blue-200/40'
                    }
                  `}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <div className="text-6xl font-light mb-6 group-hover:scale-110 transition-transform duration-300" 
                       style={{ fontFamily: 'Georgia, serif' }}>
                    {op.symbol}
                  </div>
                  <div className="text-lg font-medium" 
                       style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                    {op.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Tables/Range Selection */}
        {setupStep === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-base sm:text-lg font-light text-gray-600 mb-2">
                {operation === 'multiplication' ? 'selecciona las tablas de multiplicar' : 'selecciona el rango de números'}
              </p>
              <p className="text-sm text-gray-500">
                Operación: <strong className="capitalize text-blue-700">{operations.find(op => op.key === operation)?.label}</strong>
              </p>
            </div>

            {operation === 'multiplication' ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  {[2, 3, 4, 5, 6, 7, 8, 9].map(table => (
                    <button
                      key={table}
                      onClick={() => {
                        setSelectedTables(prev => 
                          prev.includes(table) 
                            ? prev.filter(t => t !== table)
                            : [...prev, table]
                        );
                      }}
                      className={`
                        touch-target-lg p-4 sm:p-6 rounded-xl font-bold text-2xl sm:text-3xl
                        transition-all duration-200 active:scale-95 no-select transform
                        ${selectedTables.includes(table)
                          ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl border border-blue-400/30 backdrop-blur-xl'
                          : 'bg-white/85 backdrop-blur-xl border border-white/30 shadow-md hover:shadow-lg text-slate-800 hover:border-blue-200/50 hover:bg-white/90'
                        }
                      `}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                      }}
                    >
                      {table}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={startGame}
                  disabled={selectedTables.length === 0}
                  className={`w-full px-6 py-3.5 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
                    selectedTables.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  style={{
                    color: selectedTables.length === 0 ? '#9CA3AF' : '#111827',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    background: selectedTables.length === 0 ? '#F3F4F6' : 'linear-gradient(135deg, #DBEAFE, #EDE9FE)',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <span className="mr-2">🎯</span>
                  comenzar con {selectedTables.length} {selectedTables.length === 1 ? 'tabla' : 'tablas'}
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {numberRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => setNumberRange(range.value)}
                      className={`p-6 rounded-xl transition-all duration-500 hover:scale-105 active:scale-95 ${
                        numberRange === range.value
                          ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl'
                          : 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:shadow-xl'
                      }`}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        color: numberRange === range.value ? 'white' : '#111827'
                      }}
                    >
                      <div className="text-2xl font-bold mb-1">{range.label}</div>
                      <div className="text-sm opacity-80">
                        {numberRange === range.value ? '✓ ' : ''}{range.description}
                      </div>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={startGame}
                  className="w-full px-6 py-3.5 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95"
                  style={{
                    color: '#111827',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <span className="mr-2">🎯</span>
                  comenzar entrenamiento
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;