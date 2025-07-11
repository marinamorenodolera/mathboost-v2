import React from 'react';

// Componente para animaciones de entrada
export const FadeIn = ({ children, delay = 0, duration = 500, className = "" }) => {
  const style = {
    animation: `fadeIn ${duration}ms ease-out ${delay}ms both`,
    animationFillMode: 'both'
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

// Componente para animaciones de escala
export const ScaleIn = ({ children, delay = 0, duration = 300, className = "" }) => {
  const style = {
    animation: `scaleIn ${duration}ms ease-out ${delay}ms both`,
    animationFillMode: 'both'
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

// Componente para animaciones de deslizamiento
export const SlideUp = ({ children, delay = 0, duration = 400, distance = 20, className = "" }) => {
  const style = {
    animation: `slideUp-${distance} ${duration}ms ease-out ${delay}ms both`,
    animationFillMode: 'both'
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

// Componente para feedback de toque
export const TouchFeedback = ({ children, className = "", disabled = false, ...props }) => {
  return (
    <div 
      className={`touch-feedback ${disabled ? 'disabled' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Componente para animaciones de pulso
export const Pulse = ({ children, active = false, className = "" }) => {
  return (
    <div className={`${active ? 'animate-pulse-gentle' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Componente para animaciones de número
export const NumberTransition = ({ children, className = "" }) => {
  return (
    <div className={`number-transition ${className}`}>
      {children}
    </div>
  );
};

// Hook para animaciones de lista
export const useStaggeredAnimation = (itemCount, baseDelay = 0, delayIncrement = 100) => {
  return Array.from({ length: itemCount }, (_, index) => ({
    animationDelay: `${baseDelay + (index * delayIncrement)}ms`
  }));
};