import React from 'react';

// Sistema tipográfico usando MathBoost Design System
const typography = {
  // Títulos principales
  h1: "mathboost-h1",
  h2: "mathboost-h2", 
  h3: "mathboost-h3",
  h4: "mathboost-h4",
  
  // Texto del cuerpo
  body: "mathboost-body",
  bodySmall: "mathboost-body-small",
  caption: "mathboost-caption",
  
  // Matemáticas y números
  mathHuge: "mathboost-math mathboost-math-xl",
  mathLarge: "mathboost-math mathboost-math-lg",
  mathMedium: "mathboost-math mathboost-math-md",
  mathSmall: "mathboost-math mathboost-math-sm",
  
  // Botones
  buttonLarge: "mathboost-button mathboost-button-lg",
  buttonMedium: "mathboost-button mathboost-button-md",
  buttonSmall: "mathboost-button mathboost-button-sm",
};

// Usar variables CSS del design system
const fontFamilies = {
  sans: "var(--mathboost-font-body)",
  serif: "var(--mathboost-font-math)",
  display: "var(--mathboost-font-display)"
};

// Componentes tipográficos
export const H1 = ({ children, className = "", style = {} }) => (
  <h1 
    className={`${typography.h1} ${className}`}
    style={{ ...style }}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className = "", style = {} }) => (
  <h2 
    className={`${typography.h2} ${className}`}
    style={{ ...style }}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className = "", style = {} }) => (
  <h3 
    className={`${typography.h3} ${className}`}
    style={{ ...style }}
  >
    {children}
  </h3>
);

export const Body = ({ children, className = "", style = {} }) => (
  <p 
    className={`${typography.body} ${className}`}
    style={{ ...style }}
  >
    {children}
  </p>
);

export const MathDisplay = ({ children, className = "", size = "huge", style = {} }) => {
  const sizeMap = {
    huge: typography.mathHuge,
    large: typography.mathLarge,
    medium: typography.mathMedium,
    small: typography.mathSmall
  };
  
  return (
    <div 
      className={`${sizeMap[size]} ${className}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

export const Button = ({ children, className = "", size = "medium", style = {} }) => {
  const sizeMap = {
    large: typography.buttonLarge,
    medium: typography.buttonMedium,
    small: typography.buttonSmall
  };
  
  return (
    <span 
      className={`${sizeMap[size]} ${className}`}
      style={{ ...style }}
    >
      {children}
    </span>
  );
};

export { typography, fontFamilies };