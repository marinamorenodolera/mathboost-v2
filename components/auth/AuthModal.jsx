'use client';
import React, { useState, useEffect } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode) // 'login' or 'register'

  // Reset mode when modal opens with a different initial mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
        >
          ✕
        </button>
        
        {mode === 'login' ? (
          <LoginForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  )
}