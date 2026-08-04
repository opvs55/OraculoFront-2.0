// src/context/AuthContext.jsx - VERSÃO COM PERFIL INTEGRADO
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { identifyUser, resetAnalytics, trackEvent } from '../lib/analytics';

export const AuthContext = createContext(undefined);

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
          .from('profiles') // 1. Nome da sua tabela
          .select('username, avatar_url, full_name, bio, minha_historia, entidade_cultuada') // 2. Colunas que queremos disponíveis globalmente
          .eq('id', userId) // 3. A ligação é 'id' = 'userId'
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfile(data); // 4. Armazena os dados do perfil no state
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error.message);
      } finally {
        // 5. O loading termina DEPOIS de tentar buscar o perfil
        setLoading(false);
      }
    };

    // Listener principal do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Utilizador logado: Busca o perfil
          fetchProfile(currentUser.id);
          identifyUser(currentUser.id, { email: currentUser.email });
        } else {
          // Utilizador deslogado: Limpa o perfil e termina o loading
          setProfile(null);
          setLoading(false);
        }

        // SIGNED_IN só dispara em um login/cadastro de fato (não na restauração
        // de sessão existente ao abrir a página, que é INITIAL_SESSION).
        if (event === 'SIGNED_IN') {
          trackEvent('login');
        }

        if (event === 'SIGNED_OUT') {
          queryClient.clear();
          setProfile(null);
          resetAnalytics();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value = {
    user, // O objeto de autenticação (user.id, user.email)
    profile, // O objeto do perfil (profile.username, profile.avatar_url, etc)
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
