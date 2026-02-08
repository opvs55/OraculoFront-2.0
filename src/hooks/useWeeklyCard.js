import { useEffect, useMemo, useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const shouldLog = import.meta.env.DEV;

  const queryKey = ['weeklyCard', userId, weekStart];

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        if (shouldLog) {
          console.error('[WeeklyCard] supabase error', error);
        }
      }
      setSession(data.session ?? null);
      setIsSessionLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [shouldLog]);

  useEffect(() => {
    if (shouldLog) {
      console.log(
        '[WeeklyCard] session?',
        !!session,
        'sessionUser',
        session?.user?.id,
        'userIdParam',
        userId,
        'weekStart',
        weekStart,
      );
    }
  }, [session, userId, weekStart, shouldLog]);

  const logSupabaseError = (error) => {
    if (shouldLog && error) {
      console.error('[WeeklyCard] supabase error', error);
    }
  };

  const getFriendlyErrorMessage = (error) => {
    if (!error) return null;
    if (error.status === 403 || error.code === '42501') {
      return 'Sua sessão expirou. Faça login novamente.';
    }
    if (error.message === 'Sessão não encontrada.') {
      return 'Sua sessão expirou. Faça login novamente.';
    }
    return 'Não foi possível carregar sua carta da semana.';
  };

  const fetchWeeklyRecord = async () => {
    const { data, error } = await supabase
      .from('weekly_cards')
      .select('id, week_start, card_id, card_name, created_at, metadata')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .limit(1);

    if (error) {
      logSupabaseError(error);
      throw error;
    }
    return data?.[0] ?? null;
  };

  const { data: weeklyRecord, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId || !session) return null;
      return fetchWeeklyRecord();
    },
    enabled: !!userId && !!session && !isSessionLoading,
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (error) => {
      logSupabaseError(error);
      setErrorMessage(getFriendlyErrorMessage(error));
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');
      setErrorMessage(null);

      if (shouldLog) {
        console.log(
          '[WeeklyCard] before insert',
          'session?',
          !!session,
          'sessionUser',
          session?.user?.id,
          'userIdParam',
          userId,
          'weekStart',
          weekStart,
        );
      }

      if (!session) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          throw new Error('Sessão não encontrada.');
        }
        setSession(data.session);
      }

      const existing = await fetchWeeklyRecord();
      if (existing) return existing;

      const [drawnCard] = sortearUmaCarta();
      const cardDetails = baralhoDetalhado.find((card) => card.id === drawnCard.id);
      if (!cardDetails) throw new Error('Carta sorteada não encontrada.');

      const { error } = await supabase
        .from('weekly_cards')
        .insert({
          user_id: userId,
          week_start: weekStart,
          card_id: cardDetails.id,
          card_name: cardDetails.nome,
          metadata: {
            keywords: cardDetails.palavras_chave?.direito?.slice(0, 3) || [],
          },
        });

      if (error) {
        if (error.code === '23505') {
          return fetchWeeklyRecord();
        }
        logSupabaseError(error);
        throw error;
      }
      return fetchWeeklyRecord();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data ?? null);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      logSupabaseError(error);
      setErrorMessage(getFriendlyErrorMessage(error));
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
    isSessionLoading,
    isLoading: isLoading || isSessionLoading,
    errorMessage,
  };
}
