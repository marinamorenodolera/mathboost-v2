'use client';
import React, { useState } from 'react';
import AuthModal from './auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

const MathBoostLanding = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleOpenAuth = () => {
    setShowAuthModal(true);
  };

  if (user) {
    // Si el usuario está logueado, redirigir o mostrar otro contenido
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-3xl font-light text-gray-900" 
            style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          mathboost
        </h1>
        <p className="text-sm text-gray-600 mt-1">Entrena tu velocidad mental</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Brain Icon */}
          <div className="mb-8">
            <span className="text-8xl">🧠</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Desarrolla tu velocidad mental
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Practica ejercicios matemáticos adaptados a tu nivel. 
            Mejora tu agilidad mental con sesiones diarias cortas y efectivas.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleOpenAuth}
            className="px-8 py-4 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 mb-6"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
            }}
          >
            <span className="inline-block mr-2">🚀</span>
            Comenzar ahora
          </button>

          {/* Features Line */}
          <div className="text-sm text-gray-500">
            Gratis • Sin límites • Progreso personalizado
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🧠</span>
          <span className="text-gray-700 font-medium">Entrena tu mente</span>
        </div>
        <p className="text-sm text-gray-500">
          Ejercicios diarios para mantener tu mente ágil y activa
        </p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="signup"
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MathBoostLanding;