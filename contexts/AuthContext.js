'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función simple para cargar perfil
  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
      } else {
        // Profile básico si no existe
        setProfile({
          id: userId,
          username: 'usuario',
          display_name: 'Usuario',
          avatar_url: '👤',
          current_level: 1
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Profile básico como fallback
      setProfile({
        id: userId,
        username: 'usuario',
        display_name: 'Usuario',
        avatar_url: '👤',
        current_level: 1
      });
    }
  };

  useEffect(() => {
    // Obtener sesión inicial sin timeout
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listener de cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Funciones de auth que las pantallas esperan
  const signUp = async (email, password, metadata = {}) => {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};