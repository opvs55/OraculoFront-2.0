import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearUmaCarta } from '../services/tarotService';
import { baralhoDetalhado } from '../tarotDeck';

// Função auxiliar para verificar se já se passaram 7 dias
const hasSevenDaysPassed = (lastDrawTimestamp) => {
  if (!lastDrawTimestamp) return true; 
  
  const lastDrawDate = new Date(lastDrawTimestamp);
  const now = new Date();
  const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
  
  return (now.getTime() - lastDrawDate.getTime()) >= sevenDaysInMillis;
};

export function useCardOfTheWeek(userId) {
  const queryClient = useQueryClient();
  // Usamos uma chave de query específica para a carta da semana, separada do perfil completo
  const queryKey = ['cardOfTheWeek', userId]; 

  // 1. Busca APENAS os dados da carta da semana e a data do perfil
  const { data: weeklyData, isLoading: isLoadingData } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('card_of_the_week, last_weekly_draw')
        .eq('id', userId)
        .single();
        
      // Tratamento de erro específico se o perfil não for encontrado (raro, mas possível)
      if (error && error.code === 'PGRST116') { 
          console.warn("Perfil não encontrado para buscar a carta da semana.");
          return { card_of_the_week: null, last_weekly_draw: null }; // Retorna nulo para evitar quebrar
      } else if (error) {
          throw new Error(error.message);
      }
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Considera os dados "frescos" por 5 minutos
  });

  // 2. Estados locais
  const [currentCard, setCurrentCard] = useState(null);
  const [revealAllowed, setRevealAllowed] = useState(false);

  // 3. Efeito para processar os dados buscados
  useEffect(() => {
    if (weeklyData) {
      const canRevealNow = hasSevenDaysPassed(weeklyData.last_weekly_draw);
      setRevealAllowed(canRevealNow);
      
      if (!canRevealNow && weeklyData.card_of_the_week?.id !== undefined) {
        const savedCardDetails = baralhoDetalhado.find(card => card.id === weeklyData.card_of_the_week.id);
        setCurrentCard(savedCardDetails || null);
      } else {
        setCurrentCard(null); // Reseta se puder revelar ou se não houver carta salva
      }
    } else if (!isLoadingData) {
        // Se terminou de carregar e não veio dado (ex: perfil não encontrado), permite revelar
        setRevealAllowed(true);
        setCurrentCard(null);
    }
  }, [weeklyData, isLoadingData]);

  // 4. Mutação para sortear e salvar
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId || !revealAllowed) throw new Error("Não é permitido revelar a carta agora.");

      const [drawnCardBase] = sortearUmaCarta();
      const drawnCardDetails = baralhoDetalhado.find(card => card.id === drawnCardBase.id);
      
      if (!drawnCardDetails) throw new Error("Erro ao encontrar detalhes da carta sorteada.");

      const now = new Date().toISOString();
      const updates = {
        card_of_the_week: { id: drawnCardDetails.id }, // Salva apenas o ID
        last_weekly_draw: now,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      
      return drawnCardDetails;
    },
    onSuccess: (drawnCardDetails) => {
      setCurrentCard(drawnCardDetails);
      setRevealAllowed(false);
      // Invalida o cache específico da carta da semana para forçar a re-busca na próxima visita
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error) => {
      console.error("Erro ao revelar a carta da semana:", error);
      // Adicionar feedback para o usuário aqui seria ideal
    }
  });

  // 5. Retorno do hook
  return {
    cardData: currentCard,
    revealAllowed: revealAllowed,
    revealCard: mutation.mutate, 
    isRevealing: mutation.isPending,
    isLoading: isLoadingData, // Renomeado para clareza
  };
}
