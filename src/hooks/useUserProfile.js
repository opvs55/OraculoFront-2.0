// src/hooks/useUserProfile.js - VERSÃO EVOLUÍDA (MANTENDO O NOME ORIGINAL)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

// O hook mantém seu nome original, mas agora gerencia TUDO relacionado ao perfil.
export function useUserProfile(userId) {
  const queryClient = useQueryClient();

  // 1. A QUERY para LER os dados do perfil (como antes)
  const { data: profile, ...queryInfo } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });

  // 2. A MUTATION para ATUALIZAR os dados do perfil (a nova funcionalidade)
  const { mutate: updateProfile, ...mutationInfo } = useMutation({
    mutationFn: async (updates) => {
      if (!userId) throw new Error("Usuário não está logado.");
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw error;
    },
    // Após uma atualização bem-sucedida, invalida a query para forçar a busca dos dados atualizados.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });

  // 4. O hook retorna os dados da query, a nova função de mutação e os estados de ambos.
  return {
    profile,
    updateProfile, // Agora a função de update é exportada daqui.
    isLoading: queryInfo.isLoading,
    isUpdating: mutationInfo.isPending,
    error: queryInfo.error || mutationInfo.error,
  };
}