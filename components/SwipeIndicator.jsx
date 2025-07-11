import React, { useState, useEffect } from 'react';

const SwipeIndicator = ({ direction = 'horizontal', show = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const indicators = {
    horizontal: {
      left: '← desliza para navegar →',
      icon: '↔️',
      position: 'bottom-4 left-1/2 transform -translate-x-1/2'
    },
    up: {
      left: '↑ desliza hacia arriba',
      icon: '⬆️',
      position: 'bottom-20 left-1/2 transform -translate-x-1/2'
    }
  };

  const indicator = indicators[direction] || indicators.horizontal;

  return (
    <div 
      className={`fixed ${indicator.position} z-50 px-4 py-2 bg-black/80 text-white text-sm rounded-full animate-fade-in pointer-events-none`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{indicator.icon}</span>
        <span>{indicator.left}</span>
      </div>
    </div>
  );
};

export default SwipeIndicator;