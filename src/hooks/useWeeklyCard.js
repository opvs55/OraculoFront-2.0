import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearUmaCarta } from '../services/tarotService';
import { baralhoDetalhado } from '../tarotDeck';

const getWeekStart = (date = new Date()) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const formatWeekStart = (date) => date.toISOString().split('T')[0];

const resolveCardDetails = (record) => {
  if (!record) return null;
  if (record.card_id !== undefined && record.card_id !== null) {
    return baralhoDetalhado.find((card) => card.id === record.card_id) || null;
  }
  if (record.card_name) {
    return baralhoDetalhado.find((card) => card.nome === record.card_name) || null;
  }
  return null;
};

export function useWeeklyCard(userId) {
  const queryClient = useQueryClient();
  const weekStart = useMemo(() => formatWeekStart(getWeekStart()), []);

  const queryKey = ['weeklyCard', userId, weekStart];

  const { data: weeklyRecord, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('weekly_cards')
        .select('id, week_start, card_id, card_name, created_at, metadata')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');

      const { data: existing, error: existingError } = await supabase
        .from('weekly_cards')
        .select('id, week_start, card_id, card_name, created_at, metadata')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existing) return existing;

      const [drawnCard] = sortearUmaCarta();
      const cardDetails = baralhoDetalhado.find((card) => card.id === drawnCard.id);
      if (!cardDetails) throw new Error('Carta sorteada não encontrada.');

      const { data, error } = await supabase
        .from('weekly_cards')
        .insert({
          user_id: userId,
          week_start: weekStart,
          card_id: cardDetails.id,
          card_name: cardDetails.nome,
          metadata: {
            keywords: cardDetails.palavras_chave?.direito?.slice(0, 3) || [],
          },
        })
        .select('id, week_start, card_id, card_name, created_at, metadata')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const cardDetails = resolveCardDetails(weeklyRecord);

  return {
    weekStart,
    weeklyRecord,
    cardDetails,
    revealAllowed: !weeklyRecord && !isLoading,
    revealCard: mutation.mutate,
    isRevealing: mutation.isPending,
    isLoading,
  };
}
