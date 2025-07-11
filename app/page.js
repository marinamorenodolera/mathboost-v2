'use client';
import React, { useState } from 'react';
import { AuthModal } from '../components/auth/AuthModal';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background shapes - WelcomeScreen style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tl from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Brain Icon without background - slow animation */}
          <div className="mb-6 sm:mb-8">
            <span className="text-6xl sm:text-7xl inline-block animate-pulse">🧠</span>
          </div>
          
          {/* Logo - simple text like WelcomeScreen */}
          <h1 className="text-4xl font-light text-gray-800 mb-3 sm:mb-4" 
              style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            mathboost
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl text-gray-800 font-medium mb-2 sm:mb-3" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Entrena tu mente matemática
          </h2>
          
          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 px-4" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            Mejora tu velocidad • Sigue tu progreso • Alcanza nuevos niveles
          </p>
          
          {/* Buttons with WelcomeScreen styling */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            {/* Primary button */}
            <button 
              onClick={() => handleOpenAuth('signup')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <span className="inline-block mr-2">🚀</span>
              Comenzar Gratis
            </button>
            
            {/* Secondary button with glassmorphism */}
            <button 
              onClick={() => handleOpenAuth('signin')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-gray-700 font-medium rounded-2xl bg-white/85 backdrop-blur-xl border border-black/5 shadow-md hover:shadow-lg hover:bg-white/95 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              Iniciar Sesión
            </button>
          </div>
          
          {/* Social proof with better margins */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 px-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg">👥</span>
              <span>+10K usuarios</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg">⚡</span>
              <span>85% mejora</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg">🏆</span>
              <span>Resultados reales</span>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
      />
    </div>
  );
}