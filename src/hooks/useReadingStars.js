// src/hooks/useReadingStars.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient'; // Ajuste o caminho se necessário

/**
 * Hook personalizado para gerir as "estrelas" (likes) de uma leitura.
 *
 * @param {string} readingId O ID da leitura.
 * @param {string | null} userId O ID do utilizador logado (ou null se for convidado).
 */
export function useReadingStars(readingId, userId) {
  const queryClient = useQueryClient();
  const queryKey = ['readingStars', readingId]; // Chave de cache para estes dados

  // 1. QUERY: Para buscar os dados das estrelas
  const { data, isLoading: isLoadingStars } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!readingId) return { totalStars: 0, userHasStarred: false };

      // Query 1: Buscar a contagem total de estrelas
      const { count, error: countError } = await supabase
        .from('stars')
        .select('*', { count: 'exact', head: true }) // 'head: true' otimiza para trazer só a contagem
        .eq('reading_id', readingId);

      if (countError) throw countError;

      // Query 2: Verificar se o utilizador ATUAL já deu estrela
      let userHasStarred = false;
      if (userId) {
        const { data: starData, error: userStarError } = await supabase
          .from('stars')
          .select('id')
          .eq('reading_id', readingId)
          .eq('user_id', userId)
          .maybeSingle(); // Retorna um objeto ou null, sem dar erro se não encontrar

        if (userStarError) throw userStarError;
        userHasStarred = starData !== null;
      }

      return { totalStars: count || 0, userHasStarred };
    },
    // Só executa se readingId e userId estiverem definidos (ou userId for null)
    enabled: !!readingId, 
  });

  // --- MUTATIONS: Para adicionar ou remover estrelas ---

  // 2. MUTATION: Adicionar Estrela
  const addStarMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('É preciso estar logado para dar estrela.');
      
      const { error } = await supabase
        .from('stars')
        .insert({ reading_id: readingId, user_id: userId });

      if (error) throw error;
    },
    onSuccess: () => {
      // Atualiza o cache localmente para uma UI instantânea
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return { totalStars: 1, userHasStarred: true };
        return {
          totalStars: oldData.totalStars + 1,
          userHasStarred: true,
        };
      });
    },
    onError: (error) => {
      console.error("Erro ao adicionar estrela:", error);
      // (Opcional) Reverter a atualização otimista se falhar
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // 3. MUTATION: Remover Estrela
  const removeStarMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Utilizador não logado.');

      const { error } = await supabase
        .from('stars')
        .delete()
        .eq('reading_id', readingId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Atualiza o cache localmente
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return { totalStars: 0, userHasStarred: false };
        return {
          totalStars: Math.max(0, oldData.totalStars - 1), // Evita contagem negativa
          userHasStarred: false,
        };
      });
    },
    onError: (error) => {
      console.error("Erro ao remover estrela:", error);
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // 4. Expor os dados e funções
  return {
    totalStars: data?.totalStars || 0,
    userHasStarred: data?.userHasStarred || false,
    isLoadingStars,
    addStar: addStarMutation.mutate,
    isAddingStar: addStarMutation.isPending,
    removeStar: removeStarMutation.mutate,
    isRemovingStar: removeStarMutation.isPending,
  };
}