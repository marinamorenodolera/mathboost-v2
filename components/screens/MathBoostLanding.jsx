'use client';
import React, { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';

const MathBoostLanding = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      emoji: '🧠',
      title: 'Entrena tu mente',
      description: 'Desarrolla velocidad mental con ejercicios de cálculo adaptados a tu nivel'
    },
    {
      emoji: '📊',
      title: 'Progreso visual',
      description: 'Sigue tu evolución con estadísticas detalladas y metas personalizadas'
    },
    {
      emoji: '🎯',
      title: 'Objetivos personalizados',
      description: 'Sistema de niveles que se adapta a tu velocidad y precisión'
    },
    {
      emoji: '🚀',
      title: 'Mejora continua',
      description: 'Algoritmos que ajustan la dificultad para maximizar tu aprendizaje'
    }
  ];

  const levels = [
    { name: 'Aprendiz Numérico', emoji: '🌱', category: 'Aprendiz' },
    { name: 'Explorador Matemático', emoji: '🔍', category: 'Aprendiz' },
    { name: 'Calculador Emergente', emoji: '⚡', category: 'Calculador' },
    { name: 'Procesador Rápido', emoji: '🚀', category: 'Calculador' },
    { name: 'Computador Mental', emoji: '🧠', category: 'Calculador' },
    { name: 'Matemático Líquido', emoji: '🌊', category: 'Matemático' },
    { name: 'Artista Numérico', emoji: '🎨', category: 'Matemático' },
    { name: 'Maestro de Patrones', emoji: '🔮', category: 'Matemático' },
    { name: 'Experto Intuitivo', emoji: '💎', category: 'Experto' },
    { name: 'Virtuoso del Cálculo', emoji: '🎭', category: 'Experto' },
    { name: 'Ninja Matemático', emoji: '🥷', category: 'Experto' },
    { name: 'Maestro Cuántico', emoji: '⚛️', category: 'Maestro' },
    { name: 'Genio Computacional', emoji: '🧬', category: 'Maestro' },
    { name: 'Dios Matemático', emoji: '🌟', category: 'Maestro' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-4xl font-light text-gray-800 mb-2" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          mathboost
        </h1>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          Entrena tu velocidad mental
        </p>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">🧠</div>
            <h2 className="text-3xl font-medium text-gray-800 mb-4" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Desarrolla tu velocidad mental
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Entrena con ejercicios de cálculo mental adaptados a tu nivel. Mejora tu velocidad, precisión y confianza matemática.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-3.5 text-gray-800 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)'
              }}
            >
              <span className="inline-block mr-2 text-lg">🚀</span>
              Comenzar ahora
            </button>
            
            <div className="text-sm text-gray-500">
              Gratis • Sin límites • Progreso personalizado
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 group transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.emoji}
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Levels Preview */}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium text-gray-800 mb-4" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Sistema de niveles
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Progresa a través de 15 niveles únicos diseñados para desafiar tu mente
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {levels.map((level, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20 group transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {level.emoji}
                </div>
                <div className="text-xs font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  {level.name}
                </div>
                <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  {level.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 rounded-xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-3" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              ¿Listo para comenzar?
            </h4>
            <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
              Únete a miles de personas que ya están mejorando su velocidad mental
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
              }}
            >
              <span className="inline-block mr-2">🎯</span>
              Empezar entrenamiento
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default MathBoostLanding;