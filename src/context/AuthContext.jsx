/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx - VERSÃO COM PERFIL INTEGRADO

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext(undefined);

const isProfileComplete = (profile) => {
  if (!profile) return false;

  const requiredFields = [
    profile.username,
    profile.full_name,
    profile.bio,
    profile.minha_historia,
    profile.entidade_cultuada,
    profile.avatar_url,
  ];

  const hasAllRequiredFields = requiredFields.every(
    (field) => typeof field === 'string' && field.trim().length > 0
  );

  return hasAllRequiredFields && !!profile.card_of_the_week;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // O user da autenticação (auth.users)
  const [profile, setProfile] = useState(null); // Os dados da tabela (profiles)
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    /**
     * Função para buscar os dados da tabela 'profiles' do utilizador logado.
     */
    const fetchProfile = async (userId) => {
      try {
        // Usamos os nomes exatos da sua tabela e colunas
        const { data, error, status } = await supabase
          .from('profiles')
          .select(
            'username, avatar_url, full_name, bio, minha_historia, entidade_cultuada, card_of_the_week'
          )
          .eq('id', userId)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
          setLoading(false);
        }

        if (event === 'SIGNED_OUT') {
          queryClient.clear();
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value = {
    user,
    profile,
    loading,
    needsOnboarding: user && !loading ? !isProfileComplete(profile) : false,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
