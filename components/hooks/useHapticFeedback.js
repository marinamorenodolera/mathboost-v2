import { useCallback } from 'react';

const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type = 'light') => {
    if (!navigator.vibrate) return;
    
    const patterns = {
      light: [10],           // Toque ligero
      medium: [15],          // Toque medio
      heavy: [25],           // Toque fuerte
      success: [10, 50, 15], // Patrón de éxito
      error: [25, 25, 25],   // Patrón de error
      double: [10, 10, 10],  // Doble toque
      select: [5],           // Selección sutil
    };
    
    navigator.vibrate(patterns[type] || patterns.light);
  }, []);

  const success = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const error = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const select = useCallback(() => triggerHaptic('select'), [triggerHaptic]);
  const light = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const medium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const heavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);

  return {
    triggerHaptic,
    success,
    error,
    select,
    light,
    medium,
    heavy
  };
};

export default useHapticFeedback;