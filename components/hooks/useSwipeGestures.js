import { useState, useEffect, useRef } from 'react';

const useSwipeGestures = (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    setIsSwiping(true);
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    touchEndRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Determinar dirección predominante
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Swipe horizontal
      if (deltaX > 0) {
        onSwipeRight && onSwipeRight();
      } else {
        onSwipeLeft && onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Swipe vertical
      if (deltaY > 0) {
        onSwipeDown && onSwipeDown();
      } else {
        onSwipeUp && onSwipeUp();
      }
    }
    
    setIsSwiping(false);
  };

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    style: {
      touchAction: 'pan-y', // Permitir scroll vertical pero capturar swipes horizontales
      WebkitUserSelect: 'none',
      userSelect: 'none'
    }
  };

  return { swipeHandlers, isSwiping };
};

export default useSwipeGestures;