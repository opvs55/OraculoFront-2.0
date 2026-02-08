import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearUmaCarta } from '../services/tarotService';
import { baralhoDetalhado } from '../tarotDeck';

const getWeekStartUtc = (date = new Date()) => {
  const start = new Date(date);
  const day = start.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);
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
  const weekStart = useMemo(() => formatWeekStart(getWeekStartUtc()), []);

  const queryKey = ['weeklyCard', userId, weekStart];

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['supabaseSession'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 1000 * 60 * 5,
  });

  const fetchWeeklyRecord = async () => {
    const { data, error } = await supabase
      .from('weekly_cards')
      .select('id, week_start, card_id, card_name, created_at, metadata')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] ?? null;
  };

  const { data: weeklyRecord, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId || !session) return null;
      return fetchWeeklyRecord();
    },
    enabled: !!userId && !!session,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');
      if (!session) throw new Error('Sessão não encontrada.');

      const existing = await fetchWeeklyRecord();
      if (existing) return existing;

      const [drawnCard] = sortearUmaCarta();
      const cardDetails = baralhoDetalhado.find((card) => card.id === drawnCard.id);
      if (!cardDetails) throw new Error('Carta sorteada não encontrada.');

      const { data, error } = await supabase
        .from('weekly_cards')
        .insert({
          week_start: weekStart,
          card_id: cardDetails.id,
          card_name: cardDetails.nome,
          metadata: {
            keywords: cardDetails.palavras_chave?.direito?.slice(0, 3) || [],
          },
        })
        .select('id, week_start, card_id, card_name, created_at, metadata')
        .single();

      if (error) {
        if (error.code === '23505') {
          return fetchWeeklyRecord();
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data ?? null);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const cardDetails = resolveCardDetails(weeklyRecord);

  return {
    weekStart,
    weeklyRecord,
    cardDetails,
    revealAllowed: !!userId && !!session && !isSessionLoading && !weeklyRecord && !isLoading,
    revealCard: mutation.mutate,
    isRevealing: mutation.isPending,
    isLoading: isLoading || isSessionLoading,
  };
}
