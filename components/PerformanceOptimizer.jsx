import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimizaciones de rendimiento para dispositivos de gama baja
    
    // 1. Reducir animaciones en dispositivos lentos
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '100ms');
      document.documentElement.style.setProperty('--transition-slow', '200ms');
    }

    // 2. Detectar dispositivos de gama baja
    const isLowEndDevice = () => {
      // Detectar basado en memoria disponible
      if ('deviceMemory' in navigator && navigator.deviceMemory <= 2) {
        return true;
      }
      
      // Detectar basado en número de CPUs
      if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency <= 2) {
        return true;
      }
      
      // Detectar basado en conexión
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          return true;
        }
      }
      
      return false;
    };

    // 3. Aplicar optimizaciones para dispositivos de gama baja
    if (isLowEndDevice()) {
      // Reducir calidad visual
      document.documentElement.classList.add('low-end-device');
      
      // Desactivar blur effects
      const style = document.createElement('style');
      style.textContent = `
        .low-end-device .glass {
          backdrop-filter: none !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        .low-end-device .glass-hover:hover {
          backdrop-filter: none !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .low-end-device .animate-fade-in,
        .low-end-device .animate-slide-up,
        .low-end-device .animate-scale-in {
          animation: none !important;
        }
        .low-end-device .transition-mobile {
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 4. Optimizar touch events para mejor responsividad
    const optimizeTouchEvents = () => {
      // Usar passive listeners para mejor performance
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
      document.addEventListener('touchend', () => {}, { passive: true });
    };

    optimizeTouchEvents();

    // 5. Preconectar a recursos externos si los hay
    const preconnectToExternalResources = () => {
      // Solo si hay recursos externos que cargar
      // const link = document.createElement('link');
      // link.rel = 'preconnect';
      // link.href = 'https://fonts.googleapis.com';
      // document.head.appendChild(link);
    };

    preconnectToExternalResources();

    // 6. Configurar viewport para iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    // 7. Configurar CSP y optimizaciones de seguridad
    const optimizeSecurity = () => {
      // Prevenir context menu en producción
      if (process.env.NODE_ENV === 'production') {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
      }
    };

    optimizeSecurity();

  }, []);

  return null;
};

export default PerformanceOptimizer;