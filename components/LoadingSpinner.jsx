import React from 'react';

const LoadingSpinner = ({ show = false, message = "Cargando..." }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl">
        {/* Spinner */}
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Mensaje */}
        <p className="text-gray-700 font-medium" 
           style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;