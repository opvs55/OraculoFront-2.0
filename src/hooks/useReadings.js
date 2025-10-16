import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearCruzCelta, sortearTresCartas, sortearUmaCarta, sortearTemploDeAfrodite, sortearEscolhaDeCaminho } from '../services/tarotService';
import { getInterpretation } from '../services/aiService';

export function useReadingsHistory(userId) {
  return useQuery({
    queryKey: ['readings', 'history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        // ALTERAÇÃO: Adicionamos 'spread_type' à lista de colunas selecionadas.
        .select('id, created_at, question, spread_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
}

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

export function useGenerateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, user, spreadType }) => {
      
      let cards;
      switch (spreadType) {
        case 'threeCards':
          cards = sortearTresCartas();
          break;
        case 'oneCard':
          cards = sortearUmaCarta();
          break;
        case 'templeOfAphrodite':
          cards = sortearTemploDeAfrodite();
          break;
        case 'pathChoice':
          cards = sortearEscolhaDeCaminho();
          break;
        case 'celticCross':
        default:
          cards = sortearCruzCelta();
          break;
      }

      const apiResponse = await getInterpretation(question, cards, spreadType);
      
      const dataToInsert = {
        user_id: user?.id || null, 
        question,
        cards_data: cards,
        spread_type: spreadType,
        interpretation_data: apiResponse, 
      };

      if (apiResponse.interpretationType === 'simple') {
        dataToInsert.main_interpretation = apiResponse.data.mainInterpretation;
        dataToInsert.card_interpretations = apiResponse.data.cardInterpretations;
      }

      const { data: newReading, error: insertError } = await supabase
        .from('readings')
        .insert(dataToInsert)
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      return newReading;
    },
    
    onSuccess: (data, variables) => {
      if (variables.user?.id) {
        queryClient.invalidateQueries({ queryKey: ['readings', 'history', variables.user.id] });
      }
    },
  });
}

export function useUpdateDidacticCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ readingId, updatedInterpretations }) => {
      const { error } = await supabase
        .from('readings')
        .update({ didactic_interpretations: updatedInterpretations })
        .eq('id', readingId);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: (data, variables) => {
      console.log('CACHE INVALIDATED: Marcando a leitura como obsoleta para forçar a recarga.');
      queryClient.invalidateQueries({ queryKey: ['readings', 'detail', variables.readingId] });
    },
  });
}