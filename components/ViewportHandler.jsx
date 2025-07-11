import { useEffect } from 'react';

const ViewportHandler = () => {
  useEffect(() => {
    // Función para calcular la altura real del viewport
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Configurar altura inicial
    setViewportHeight();

    // Función debounced para evitar cálculos excesivos
    let timeout;
    const debouncedSetViewportHeight = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setViewportHeight, 100);
    };

    // Escuchar cambios de tamaño
    window.addEventListener('resize', debouncedSetViewportHeight);
    window.addEventListener('orientationchange', debouncedSetViewportHeight);

    // Escuchar cambios de viewport específicos para móviles
    if ('visualViewport' in window) {
      window.visualViewport.addEventListener('resize', debouncedSetViewportHeight);
    }

    // Configuración específica para iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Prevenir zoom en double-tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Manejar el viewport cuando aparece/desaparece el teclado
      const handleViewportChange = () => {
        setTimeout(setViewportHeight, 150);
      };

      window.addEventListener('focusin', handleViewportChange);
      window.addEventListener('focusout', handleViewportChange);
    }

    // Limpiar event listeners
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', debouncedSetViewportHeight);
      window.removeEventListener('orientationchange', debouncedSetViewportHeight);
      
      if ('visualViewport' in window) {
        window.visualViewport.removeEventListener('resize', debouncedSetViewportHeight);
      }
    };
  }, []);

  return null; // Este componente no renderiza nada
};

export default ViewportHandler;