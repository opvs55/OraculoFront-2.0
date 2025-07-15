// src/context/AuthContext.jsx - VERSÃO FINAL E ROBUSTA

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // A lógica chave: Define o usuário baseado na sessão.
        // Se a sessão existir, temos um usuário. Se não, é null.
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // O loading inicial só termina depois da primeira verificação.
        setLoading(false);

        // Se o usuário deslogar, limpa o cache para não mostrar dados antigos.
        if (event === 'SIGNED_OUT') {
          queryClient.clear();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value = {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}