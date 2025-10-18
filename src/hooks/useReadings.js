// src/hooks/useReadings.js (VERSÃO FINAL CORRIGIDA)

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearCruzCelta, sortearTresCartas, sortearUmaCarta, sortearTemploDeAfrodite, sortearEscolhaDeCaminho } from '../services/tarotService';
import { getInterpretation } from '../services/aiService';

const READINGS_PER_PAGE = 12;

// --- FUNÇÃO PARA O FEED DA COMUNIDADE (COM A CORREÇÃO) ---
export function usePublicReadings(sortBy = { column: 'created_at', ascending: false }) {
  const queryKey = ['publicReadings', sortBy];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * READINGS_PER_PAGE;
      const to = from + READINGS_PER_PAGE - 1;

      // Inicia a construção da query
      let query = supabase
        .from('readings')
        .select(`
          id, created_at, shared_title, question, spread_type, cards_data,
          profiles ( username, avatar_url ),
          stars ( count ),
          comments ( count )
        `, { count: 'exact' })
        .eq('is_public', true);

      // --- AQUI ESTÁ A LÓGICA DA CORREÇÃO ---
      // Se for para ordenar por 'populares' (estrelas)...
      if (sortBy.column === 'stars') {
        // ...usamos a sintaxe especial para tabelas estrangeiras
        query = query.order('count', { foreignTable: 'stars', ascending: false });
      } else {
        // ...senão, usamos a ordenação padrão (por data de criação)
        query = query.order('created_at', { ascending: false });
      }
      // --- FIM DA CORREÇÃO ---

      // Aplica a paginação no final
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: data || [], count };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap(p => p.data).length;
      if (lastPage.count && loadedCount < lastPage.count) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  return {
    pages: data?.pages || [],
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}


// --- SUAS FUNÇÕES EXISTENTES (INTACTAS) ---

export function useReadingsHistory(userId) {
  return useQuery({
    queryKey: ['readings', 'history', userId],
    queryFn: async () => {
      if (!userId) return []; 
      const { data, error } = await supabase
        .from('readings')
        .select('id, created_at, question, spread_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar histórico:", error);
        throw new Error(`Erro ao buscar histórico: ${error.message}`);
      }
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useSingleReading(readingId) {
  const isTemporaryId = readingId?.startsWith('temp-');
  return useQuery({
    queryKey: ['readings', 'detail', readingId],
    queryFn: async () => {
      if (isTemporaryId) {
          console.warn("useSingleReading: Tentativa de buscar leitura temporária por ID ignorada:", readingId);
          return null; 
      }
      if (!readingId) return null;
      const { data, error } = await supabase
        .from('readings')
        .select(`*, profiles ( username, avatar_url )`)
        .eq('id', readingId)
        .single();
      if (error && error.code === 'PGRST116'){
          console.warn("Leitura não encontrada no banco:", readingId);
          throw new Error('Leitura não encontrada.');
      } else if (error) {
        console.error("Erro ao buscar leitura única:", error);
        throw new Error(`Erro ao buscar leitura: ${error.message}`);
      }
      return data;
    },
    enabled: !!readingId && !isTemporaryId, 
    retry: (failureCount, error) => {
        if (error.message === 'Leitura não encontrada.') return false;
        return failureCount < 3;
    }
  });
}

export function useGenerateReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ question, user, spreadType }) => {
      console.log("[useGenerateReading] Iniciando. User recebido:", user); 
      let cards;
      switch (spreadType) {
        case 'threeCards': cards = sortearTresCartas(); break;
        case 'oneCard': cards = sortearUmaCarta(); break;
        case 'templeOfAphrodite': cards = sortearTemploDeAfrodite(); break;
        case 'pathChoice': cards = sortearEscolhaDeCaminho(); break;
        case 'celticCross': default: cards = sortearCruzCelta(); break;
      }
      console.log("[useGenerateReading] Cartas sorteadas.");
      const apiResponse = await getInterpretation(question, cards, spreadType);
      console.log("[useGenerateReading] Interpretação da IA recebida.");
      if (user && user.id) { 
        console.log("[useGenerateReading] Usuário LOGADO. Preparando para salvar...");
        const dataToInsert = {
          user_id: user.id, 
          question,
          cards_data: cards,
          spread_type: spreadType,
          interpretation_data: apiResponse, 
          is_public: false,
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
        if (insertError) {
            console.error("[useGenerateReading] Erro Supabase ao INSERIR leitura:", insertError);
            throw new Error(`Erro ao salvar leitura: ${insertError.message}`); 
        }
        console.log("[useGenerateReading] Leitura salva com SUCESSO:", newReading);
        return newReading;
      } else {
        console.log("[useGenerateReading] Usuário VISITANTE. Gerando dados temporários...");
        const temporaryReading = {
          id: `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`, 
          created_at: new Date().toISOString(),
          question: question,
          cards_data: cards,
          spread_type: spreadType,
          interpretation_data: apiResponse,
          is_public: false,
          user_id: null,
          ...(apiResponse.interpretationType === 'simple' && {
              main_interpretation: apiResponse.data.mainInterpretation,
              card_interpretations: apiResponse.data.cardInterpretations
          })
        };
        console.log("[useGenerateReading] Leitura temporária gerada:", temporaryReading.id);
        return temporaryReading;
      }
    },
    onSuccess: (data, variables) => {
      if (data.user_id && variables.user?.id) { 
        console.log("Invalidando histórico para usuário:", variables.user.id);
        queryClient.invalidateQueries({ queryKey: ['readings', 'history', variables.user.id] });
      } else {
        console.log("Leitura temporária, histórico não invalidado.");
      }
    },
    onError: (error) => {
        console.error("Erro capturado em onError [useGenerateReading]:", error);
        throw error; 
    }
  });
}

export function useUpdateDidacticCache() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ readingId, updatedInterpretations }) => {
      if (readingId?.startsWith('temp-')) {
          console.warn("Tentativa de atualizar cache didático de leitura temporária ignorada.");
          return;
      }
      const { error } = await supabase
        .from('readings')
        .update({ didactic_interpretations: updatedInterpretations })
        .eq('id', readingId);
      if (error) {
          console.error("Erro ao atualizar cache didático no Supabase:", error);
          throw new Error(`Erro ao salvar cache didático: ${error.message}`);
      }
    },
    onSuccess: (data, variables) => {
       if (!variables.readingId?.startsWith('temp-')) {
           console.log('CACHE DIDÁTICO INVALIDADO:', variables.readingId);
           queryClient.invalidateQueries({ queryKey: ['readings', 'detail', variables.readingId] });
       }
    },
    onError: (error) => {
        console.error("Erro na mutação useUpdateDidacticCache:", error);
    }
  });
}