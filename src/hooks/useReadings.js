// src/hooks/useReadings.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearCruzCelta } from '../services/tarotService';
import { getInterpretation } from '../services/aiService';

// HOOK 1: Para buscar o histórico de leituras de um usuário
export function useReadingsHistory(userId) {
  return useQuery({
    // queryKey é o identificador único desta busca. TanStack usa isso para cache.
    queryKey: ['readings', 'history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select('id, created_at, question')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
    // A query só será executada se o userId for válido.
    enabled: !!userId,
  });
}

// HOOK 2: Para buscar os dados completos de UMA ÚNICA leitura
export function useSingleReading(readingId) {
  return useQuery({
    queryKey: ['readings', 'detail', readingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('id', readingId)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!readingId,
  });
}

// HOOK 3 (Mutation): Para CRIAR uma nova leitura
export function useGenerateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, user }) => {
      if (!user?.id) throw new Error("Você precisa estar logado para gerar uma leitura.");

      // 1. Lógica de negócio
      const cards = sortearCruzCelta();
      const { mainInterpretation, cardInterpretations } = await getInterpretation(question, cards);
      
      // 2. Inserção no banco
      const { data: newReading, error: insertError } = await supabase
        .from('readings')
        .insert({
          user_id: user.id,
          question,
          cards_data: cards,
          main_interpretation: mainInterpretation,
          card_interpretations: cardInterpretations,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      return newReading;
    },

    
    // 3. Após o sucesso, invalida o cache do histórico para que ele seja atualizado automaticamente.
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['readings', 'history', variables.user.id] });
    },
  });
}


// HOOK 4 (Mutation): Para ATUALIZAR uma leitura com o texto didático
export function useUpdateDidacticCache() {
  const queryClient = useQueryClient();

  return useMutation({
    // A função de mutação recebe as variáveis que passamos a ela
    mutationFn: async ({ readingId, updatedInterpretations }) => {
      const { error } = await supabase
        .from('readings')
        .update({ didactic_interpretations: updatedInterpretations })
        .eq('id', readingId);
      
      if (error) throw new Error(error.message);
    },
    // Após o sucesso da mutação...
    onSuccess: (data, variables) => {
      // ...nós dizemos ao React Query para invalidar (marcar como obsoleto)
      // o cache daquela leitura específica. Isso forçará o useSingleReading
      // a buscar os dados mais recentes do banco na próxima vez que for necessário.
      console.log('CACHE INVALIDATED: Marcando a leitura como obsoleta para forçar a recarga.');
      queryClient.invalidateQueries({ queryKey: ['readings', 'detail', variables.readingId] });
    },
  });
}