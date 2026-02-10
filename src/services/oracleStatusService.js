import { supabase } from '../supabaseClient';

export function getWeekStartISO(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export async function fetchOracleStatus(userId) {
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  const weekStart = getWeekStartISO();

  const [personalResult, natalResult, weeklyResult, unifiedResult] = await Promise.all([
    supabase
      .from('numerology_readings')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('natal_charts')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('numerology_weekly_readings')
      .select('id, week_start, created_at')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('unified_readings')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  for (const result of [personalResult, natalResult, weeklyResult, unifiedResult]) {
    if (result.error) {
      throw result.error;
    }
  }

  return {
    personalNumerology: {
      done: Boolean(personalResult.data),
      created_at: personalResult.data?.created_at,
    },
    natalChart: {
      done: Boolean(natalResult.data),
      created_at: natalResult.data?.created_at,
    },
    weeklyNumerology: {
      done: Boolean(weeklyResult.data),
      week_start: weekStart,
      id: weeklyResult.data?.id,
    },
    unified: {
      last_id: unifiedResult.data?.id,
      last_created_at: unifiedResult.data?.created_at,
    },
  };
}
