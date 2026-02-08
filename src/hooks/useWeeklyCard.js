import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearUmaCarta } from '../services/tarotService';
import { baralhoDetalhado } from '../tarotDeck';

// Semana começa na segunda-feira em UTC
const getWeekStartUtc = (date = new Date()) => {
  const start = new Date(date);
  const day = start.getUTCDay(); // 0=domingo ... 6=sábado
  const diff = (day === 0 ? -6 : 1) - day; // leva para segunda
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
};

const formatWeekStart = (date) => date.toISOString().split('T')[0];

const resolveCardDetails = (record) => {
  if (!record) return null;

  // card_id no banco é text; no deck pode ser number/string
  if (record.card_id !== undefined && record.card_id !== null) {
    return (
      baralhoDetalhado.find((card) => String(card.id) === String(record.card_id)) || null
    );
  }

  // fallback por nome
  if (record.card_name) {
    return baralhoDetalhado.find((card) => card.nome === record.card_name) || null;
  }

  return null;
};

export function useWeeklyCard(userId) {
  const queryClient = useQueryClient();
  const weekStart = useMemo(() => formatWeekStart(getWeekStartUtc()), []);
  const queryKey = ['weeklyCard', userId, weekStart];

  const [errorMessage, setErrorMessage] = useState(null);
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const shouldLog = import.meta.env.DEV;

  // -------- AUTH SESSION --------
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error && shouldLog) {
        console.error('[WeeklyCard] getSession error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          status: error.status,
        });
      }

      setSession(data?.session ?? null);
      setIsSessionLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);
      setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [shouldLog]);

  useEffect(() => {
    if (shouldLog) {
      console.log('[WeeklyCard] debug:', {
        sessionUserId: session?.user?.id ?? null,
        userId,
        weekStart,
      });
    }
  }, [session?.user?.id, userId, weekStart, shouldLog]);

  const logSupabaseError = (error, context = 'unknown') => {
    if (!error || !shouldLog) return;
    console.error(`[WeeklyCard] ${context} error:`, {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      status: error.status,
    });
  };

  const getFriendlyErrorMessage = (error) => {
    if (!error) return null;

    // 403 / forbidden / policy
    if (error.status === 403 || error.code === '42501') {
      return 'Você não tem permissão para acessar sua carta da semana. Faça login novamente.';
    }

    // sessão ausente/expirada
    if (
      error.message === 'Sessão não encontrada.' ||
      /jwt/i.test(error.message || '') ||
      /session/i.test(error.message || '')
    ) {
      return 'Sua sessão expirou. Faça login novamente.';
    }

    return 'Não foi possível carregar sua carta da semana.';
  };

  // -------- DB READ --------
  const fetchWeeklyRecord = async (uid) => {
    const { data, error } = await supabase
      .from('weekly_cards')
      .select('id, user_id, week_start, card_id, card_name, created_at, metadata')
      .eq('user_id', uid)
      .eq('week_start', weekStart)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      logSupabaseError(error, 'fetchWeeklyRecord');
      throw error;
    }

    return data ?? null;
  };

  const {
    data: weeklyRecord,
    isLoading: isQueryLoading,
    isFetching,
  } = useQuery({
    queryKey,
    enabled: !!userId && !isSessionLoading,
    queryFn: async () => {
      if (!userId) return null;
      return fetchWeeklyRecord(userId);
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    onSuccess: () => setErrorMessage(null),
    onError: (error) => {
      logSupabaseError(error, 'useQuery');
      setErrorMessage(getFriendlyErrorMessage(error));
    },
  });

  // -------- MUTATION (REVEAL) --------
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');

      setErrorMessage(null);

      // sessão atual
      let activeSession = session;
      if (!activeSession) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          logSupabaseError(error, 'getSession in mutation');
          throw error;
        }
        activeSession = data?.session ?? null;
        setSession(activeSession);
      }

      if (!activeSession) {
        throw new Error('Sessão não encontrada.');
      }

      // proteção extra: garantir que sessão bate com userId do app
      if (activeSession.user?.id !== userId) {
        throw new Error('Sessão inválida para este usuário.');
      }

      // se já existe carta da semana, retorna a existente
      const existing = await fetchWeeklyRecord(userId);
      if (existing) return existing;

      const [drawnCard] = sortearUmaCarta();
      const cardDetails = baralhoDetalhado.find(
        (card) => String(card.id) === String(drawnCard.id)
      );

      if (!cardDetails) {
        throw new Error('Carta sorteada não encontrada no baralhoDetalhado.');
      }

      const payload = {
        user_id: userId, // explícito para facilitar debug + RLS with check
        week_start: weekStart,
        card_id: String(cardDetails.id), // padroniza como text
        card_name: cardDetails.nome,
        metadata: {
          keywords: cardDetails?.palavras_chave?.direito?.slice(0, 3) || [],
        },
      };

      const { data, error } = await supabase
        .from('weekly_cards')
        .insert(payload)
        .select('id, user_id, week_start, card_id, card_name, created_at, metadata')
        .single();

      if (error) {
        // corrida: índice único user_id+week_start
        if (error.code === '23505') {
          return fetchWeeklyRecord(userId);
        }
        logSupabaseError(error, 'insert weekly_cards');
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      queryClient.setQueryData(queryKey, data ?? null);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      logSupabaseError(error, 'mutation');
      setErrorMessage(getFriendlyErrorMessage(error));
    },
  });

  const cardDetails = resolveCardDetails(weeklyRecord);

  const isLoading = isSessionLoading || isQueryLoading || isFetching;
  const revealAllowed =
    !!userId &&
    !isSessionLoading &&
    !!session &&
    session.user?.id === userId &&
    !weeklyRecord &&
    !mutation.isPending;

  return {
    weekStart,
    weeklyRecord,
    cardDetails,
    revealAllowed,
    revealCard: mutation.mutate,
    isRevealing: mutation.isPending,
    isSessionLoading,
    isLoading,
    errorMessage,
  };
}
