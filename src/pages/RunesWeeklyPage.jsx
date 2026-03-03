import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { oraclesApi } from '../services/api/oraclesApi';
import { supabase } from '../supabaseClient';
import { upsertOracleModule } from '../services/supabase/oraclesRepo';
import RunesCast from '../components/runes/RunesCast';
import styles from './RunesWeeklyPage.module.css';

function getWeekStart(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function resolveOutputPayload(payload) {
  return payload?.data?.module?.output_payload || payload?.module?.output_payload || payload?.output_payload || {};
}

function RunesWeeklyPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const weekStart = getWeekStart();

  const moduleQuery = useQuery({
    queryKey: ['oracle-weekly-module', user?.id, weekStart, 'runes'],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oracle_weekly_modules')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .eq('module_key', 'runes')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const outputPayload = useMemo(
    () => resolveOutputPayload(moduleQuery.data?.module_output),
    [moduleQuery.data]
  );

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = await oraclesApi.getRunesReading({ userId: user.id, weekStart });
      return upsertOracleModule({ userId: user.id, weekStart, moduleKey: 'runes', moduleOutput: payload });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['oracle-weekly-module', user?.id, weekStart, 'runes'], data);
    },
  });

  const status = outputPayload?.status || moduleQuery.data?.module_output?.status;
  const weekRef = outputPayload?.week_ref || weekStart;
  const shouldShowHeader = status === 'ok';

  return (
    <div className={`content_wrapper ${styles.page}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Runas Semanais</h1>
          <p>Abra o grimório e veja as energias de Passado, Presente e Futuro.</p>
          {shouldShowHeader && <span className={styles.weekRef}>Semanal • {weekRef}</span>}
        </header>

        {moduleQuery.isLoading && <div className={styles.infoBox}>Consultando o oráculo...</div>}

        {(moduleQuery.error || status === 'error' || generateMutation.error) && (
          <div className={styles.errorBox}>
            <p>
              {(generateMutation.error || moduleQuery.error)?.message
                || outputPayload?.error
                || 'Não foi possível carregar suas runas semanais.'}
            </p>
            <button type="button" onClick={() => generateMutation.mutate()} className={styles.actionBtn}>
              Tentar novamente
            </button>
          </div>
        )}

        {!moduleQuery.isLoading && !moduleQuery.error && status !== 'error' && (
          <>
            {!shouldShowHeader && (
              <div className={styles.infoBox}>
                <p>Você ainda não gerou sua tiragem semanal.</p>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? 'Gerando...' : 'Gerar runas semanais'}
                </button>
              </div>
            )}

            {(shouldShowHeader || generateMutation.isSuccess) && (
              <RunesCast runes={outputPayload.runes || []} />
            )}
          </>
        )}

        {import.meta.env.DEV && (
          <details className={styles.devOnly}>
            <summary>Dados técnicos (DEV)</summary>
            <pre>{JSON.stringify(outputPayload, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default RunesWeeklyPage;
