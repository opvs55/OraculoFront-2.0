import { useEffect, useMemo, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { sortearUmaCarta } from '../services/tarotService';
import { baralhoDetalhado } from '../tarotDeck';

const getWeekStartUtc = (date = new Date()) => {
  const start = new Date(date);
  const day = start.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
};

const formatWeekStart = (date) => date.toISOString().split('T')[0];

const resolveCardDetails = (record) => {
  if (!record) return null;
  if (record.card_id != null) {
    return baralhoDetalhado.find((c) => c.id === record.card_id) || null;
  }
  if (record.card_name) {
    return baralhoDetalhado.find((c) => c.nome === record.card_name) || null;
  }
  return null;
};

const nowIso = () => new Date().toISOString();

export function useWeeklyCard(userId) {
  const queryClient = useQueryClient();
  const weekStart = useMemo(() => formatWeekStart(getWeekStartUtc()), []);
  const shouldLog = import.meta.env.DEV;

  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // ===== DIAGNÓSTICO EMBUTIDO =====
  const [diagnostics, setDiagnostics] = useState({
    startedAt: nowIso(),
    lastStep: 'init',
    events: [],
    auth: {
      sessionLoaded: false,
      hasSession: false,
      sessionUserId: null,
      userIdParam: userId ?? null,
    },
    query: {
      attempted: false,
      ok: false,
      foundRecord: false,
      error: null,
    },
    mutation: {
      attempted: false,
      ok: false,
      inserted: false,
      usedExisting: false,
      error: null,
    },
    selfTest: {
      lastRunAt: null,
      ok: null,
      summary: '',
      details: null,
    },
  });

  const pushDiag = useCallback((step, payload = {}) => {
    setDiagnostics((prev) => ({
      ...prev,
      lastStep: step,
      events: [
        ...prev.events.slice(-39),
        { at: nowIso(), step, ...payload },
      ],
    }));
  }, []);

  const setDiagAuth = useCallback((patch) => {
    setDiagnostics((prev) => ({
      ...prev,
      auth: { ...prev.auth, ...patch },
    }));
  }, []);

  const setDiagQuery = useCallback((patch) => {
    setDiagnostics((prev) => ({
      ...prev,
      query: { ...prev.query, ...patch },
    }));
  }, []);

  const setDiagMutation = useCallback((patch) => {
    setDiagnostics((prev) => ({
      ...prev,
      mutation: { ...prev.mutation, ...patch },
    }));
  }, []);

  const queryKey = ['weeklyCard', userId, weekStart];

  const logSupabaseError = (error, label = 'supabase error') => {
    if (shouldLog && error) console.error(`[WeeklyCard] ${label}`, error);
    pushDiag('error', {
      label,
      error: {
        message: error?.message ?? null,
        code: error?.code ?? null,
        status: error?.status ?? null,
        details: error?.details ?? null,
        hint: error?.hint ?? null,
      },
    });
  };

  const getFriendlyErrorMessage = (error) => {
    if (!error) return null;
    if (error.status === 401 || error.status === 403 || error.code === '42501') {
      return 'Sua sessão expirou. Faça login novamente.';
    }
    if (error.message === 'Sessão não encontrada.') {
      return 'Sua sessão expirou. Faça login novamente.';
    }
    return 'Não foi possível carregar sua carta da semana.';
  };

  useEffect(() => {
    let mounted = true;
    pushDiag('auth:loadSession:start');

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) logSupabaseError(error, 'getSession returned error');

        const nextSession = data?.session ?? null;
        setSession(nextSession);
        setDiagAuth({
          sessionLoaded: true,
          hasSession: !!nextSession,
          sessionUserId: nextSession?.user?.id ?? null,
          userIdParam: userId ?? null,
        });
        pushDiag('auth:loadSession:done', {
          hasSession: !!nextSession,
          sessionUserId: nextSession?.user?.id ?? null,
        });
      } catch (e) {
        if (!mounted) return;
        logSupabaseError(e, 'getSession exception');
        setSession(null);
        setDiagAuth({
          sessionLoaded: true,
          hasSession: false,
          sessionUserId: null,
          userIdParam: userId ?? null,
        });
      } finally {
        if (mounted) {
          setIsSessionLoading(false);
          pushDiag('auth:sessionLoading:false');
        }
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setIsSessionLoading(false);
      setDiagAuth({
        sessionLoaded: true,
        hasSession: !!nextSession,
        sessionUserId: nextSession?.user?.id ?? null,
        userIdParam: userId ?? null,
      });
      pushDiag('auth:onAuthStateChange', {
        hasSession: !!nextSession,
        sessionUserId: nextSession?.user?.id ?? null,
      });
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [pushDiag, setDiagAuth, shouldLog, userId]);

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
        weekStart
      );
    }
  }, [session, userId, weekStart, shouldLog]);

  const fetchWeeklyRecord = useCallback(async () => {
    if (!userId) return null;

    setDiagQuery({ attempted: true, error: null });
    pushDiag('query:weekly_cards:start', { userId, weekStart });

    const { data, error } = await supabase
      .from('weekly_cards')
      .select('id, week_start, card_id, card_name, created_at, metadata')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .limit(1);

    if (error) {
      setDiagQuery({
        ok: false,
        foundRecord: false,
        error: {
          message: error?.message ?? null,
          code: error?.code ?? null,
          status: error?.status ?? null,
        },
      });
      logSupabaseError(error, 'fetchWeeklyRecord');
      throw error;
    }

    const record = data?.[0] ?? null;
    setDiagQuery({
      ok: true,
      foundRecord: !!record,
      error: null,
    });
    pushDiag('query:weekly_cards:done', { foundRecord: !!record });
    return record;
  }, [userId, weekStart, pushDiag, setDiagQuery]);

  const { data: weeklyRecord, isLoading: isWeeklyLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId || !session) return null;
      return fetchWeeklyRecord();
    },
    enabled: !!userId && !!session && !isSessionLoading,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      setErrorMessage(null);
      pushDiag('query:onSuccess');
    },
    onError: (error) => {
      setErrorMessage(getFriendlyErrorMessage(error));
      pushDiag('query:onError');
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');

      setErrorMessage(null);
      setDiagMutation({ attempted: true, error: null, ok: false, inserted: false, usedExisting: false });

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
          weekStart
        );
      }

      pushDiag('mutation:start', {
        hasSession: !!session,
        sessionUserId: session?.user?.id ?? null,
        userIdParam: userId,
      });

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        const err = new Error('Sessão não encontrada.');
        setDiagMutation({
          ok: false,
          error: { message: err.message, code: userError?.code ?? null, status: userError?.status ?? null },
        });
        throw err;
      }

      if (userData.user.id !== userId) {
        const err = new Error('Sessão inválida para o usuário atual.');
        setDiagMutation({
          ok: false,
          error: { message: err.message, code: null, status: null },
        });
        throw err;
      }

      const existing = await fetchWeeklyRecord();
      if (existing) {
        setDiagMutation({ ok: true, usedExisting: true, inserted: false, error: null });
        pushDiag('mutation:usedExisting');
        return existing;
      }

      const [drawnCard] = sortearUmaCarta();
      const cardDetails = baralhoDetalhado.find((c) => c.id === drawnCard.id);
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
        .limit(1);

      if (error) {
        if (error.code === '23505') {
          const record = await fetchWeeklyRecord();
          setDiagMutation({ ok: true, usedExisting: true, inserted: false, error: null });
          pushDiag('mutation:unique_fallback');
          return record;
        }
        setDiagMutation({
          ok: false,
          error: {
            message: error?.message ?? null,
            code: error?.code ?? null,
            status: error?.status ?? null,
          },
        });
        logSupabaseError(error, 'insert weekly_cards');
        throw error;
      }

      setDiagMutation({ ok: true, inserted: true, usedExisting: false, error: null });
      pushDiag('mutation:inserted');
      return data?.[0] ?? null;
    },
    retry: false,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data ?? null);
      setErrorMessage(null);
      pushDiag('mutation:onSuccess');
    },
    onError: (error) => {
      logSupabaseError(error, 'mutation');
      setErrorMessage(getFriendlyErrorMessage(error));
      pushDiag('mutation:onError');
    },
  });

  const cardDetails = resolveCardDetails(weeklyRecord);

  const isLoading = isSessionLoading || isWeeklyLoading;
  const revealAllowed =
    !!userId && !!session && !isSessionLoading && !isWeeklyLoading && !weeklyRecord && !mutation.isPending;

  // ===== AUTOTESTE (SEM DEVTOOLS) =====
  const runSelfTest = useCallback(async () => {
    const startedAt = nowIso();
    pushDiag('selfTest:start');

    const result = {
      startedAt,
      checks: {
        hasUserId: !!userId,
        hasSessionState: !!session,
        sessionLoadingFinished: !isSessionLoading,
        canReadAuthUser: false,
        authUserMatchesParam: false,
        canQueryWeeklyTable: false,
      },
      authUserId: null,
      queryError: null,
      summary: '',
      ok: false,
    };

    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (!authErr && authData?.user) {
        result.checks.canReadAuthUser = true;
        result.authUserId = authData.user.id;
        result.checks.authUserMatchesParam = authData.user.id === userId;
      }

      const { error: qErr } = await supabase
        .from('weekly_cards')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .limit(1);

      if (!qErr) {
        result.checks.canQueryWeeklyTable = true;
      } else {
        result.queryError = {
          message: qErr.message,
          code: qErr.code,
          status: qErr.status,
        };
      }

      const allGood =
        result.checks.hasUserId &&
        result.checks.sessionLoadingFinished &&
        result.checks.canReadAuthUser &&
        result.checks.authUserMatchesParam &&
        result.checks.canQueryWeeklyTable;

      result.ok = allGood;
      result.summary = allGood
        ? '✅ Autoteste OK: sessão, usuário e acesso à weekly_cards estão corretos.'
        : '❌ Autoteste falhou em um ou mais pontos. Veja diagnostics.selfTest.details.';

      setDiagnostics((prev) => ({
        ...prev,
        selfTest: {
          lastRunAt: nowIso(),
          ok: result.ok,
          summary: result.summary,
          details: result,
        },
      }));

      pushDiag('selfTest:done', { ok: result.ok });
      return result;
    } catch (e) {
      const fail = {
        ...result,
        ok: false,
        summary: '❌ Autoteste encontrou exceção inesperada.',
        exception: {
          message: e?.message ?? 'Erro desconhecido',
        },
      };

      setDiagnostics((prev) => ({
        ...prev,
        selfTest: {
          lastRunAt: nowIso(),
          ok: false,
          summary: fail.summary,
          details: fail,
        },
      }));

      pushDiag('selfTest:exception', { message: e?.message ?? 'unknown' });
      return fail;
    }
  }, [isSessionLoading, pushDiag, session, userId, weekStart]);

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

    // diagnóstico embutido
    diagnostics,
    runSelfTest,
  };
}
