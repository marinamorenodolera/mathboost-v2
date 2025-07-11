'use client';
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const SimpleDebug = () => {
  const { user, profile, loading } = useAuth();
  
  console.log('DEBUG:', { user: !!user, profile: !!profile, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading auth state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">MathBoost Debug</h1>
        <div className="space-y-4">
          <p>User: {user ? '✅ Logged in' : '❌ Not logged in'}</p>
          <p>Profile: {profile ? '✅ Loaded' : '❌ Not loaded'}</p>
          <p>Loading: {loading ? '⏳ Loading' : '✅ Ready'}</p>
        </div>
        
        {!user && (
          <button 
            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg"
            onClick={() => alert('Login button - add auth modal here')}
          >
            Login
          </button>
        )}
        
        {user && (
          <div className="mt-8">
            <p>Welcome {profile?.username || user.email}!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DebugApp = () => {
  return (
    <AuthProvider>
      <SimpleDebug />
    </AuthProvider>
  );
};

export default DebugApp;