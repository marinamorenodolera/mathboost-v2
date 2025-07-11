'use client';
import React from 'react';

const UltraSimple = () => {
  console.log('🔥 ULTRA SIMPLE COMPONENT LOADED');
  
  // Log variables de entorno
  console.log('🔧 ENV CHECK:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'
  });
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>🔥 ULTRA SIMPLE TEST</h1>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Si ves esto, React funciona ✅
        </p>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Present' : '❌ Missing'}
        </p>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}
        </p>
        <button 
          onClick={() => {
            console.log('🖱️ BUTTON CLICKED');
            alert('JavaScript funciona! ✅');
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Click
        </button>
      </div>
    </div>
  );
};

export default UltraSimple;