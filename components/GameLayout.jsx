import React from 'react';

const GameLayout = ({ children, showKeyboard = false, ...swipeProps }) => {
  return (
    <div 
      className="h-dynamic flex flex-col bg-brand-background"
      {...swipeProps}
    >
      {/* Header space */}
      <div className="h-16 safe-area-top" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      
      {/* Keyboard space on mobile */}
      {showKeyboard && (
        <div className="h-keyboard sm:hidden" />
      )}
    </div>
  );
};

export default GameLayout;