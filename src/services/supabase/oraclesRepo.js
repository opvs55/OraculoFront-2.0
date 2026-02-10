import { supabase } from '../../supabaseClient';

function pickFirst(data) {
  return Array.isArray(data) ? data[0] : data;
}

function cleanPayload(payload) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

export async function saveOrGetPersonalNumerology({ userId, payload }) {
  const { data: existing, error: fetchError } = await supabase
    .from('numerology_readings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('numerology_readings')
    .insert(cleanPayload({ user_id: userId, ...payload }))
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function upsertWeeklyNumerology({ userId, weekStart, readingData }) {
  const payload = cleanPayload({
    user_id: userId,
    week_start: weekStart,
    reading_data: readingData,
  });

  const { data, error } = await supabase
    .from('numerology_weekly_readings')
    .upsert(payload, { onConflict: 'user_id,week_start' })
    .select('*');

  if (error) throw error;
  return pickFirst(data);
}

export async function saveOrGetNatalChart({ userId, payload }) {
  const { data: existing, error: fetchError } = await supabase
    .from('natal_charts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('natal_charts')
    .insert(cleanPayload({ user_id: userId, ...payload }))
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function insertUnifiedReading({ userId, weekRef, inputPayload, moduleOutputs, warnings, finalReading }) {
  const payload = cleanPayload({
    user_id: userId,
    week_ref: weekRef,
    input_payload: inputPayload,
    module_outputs: moduleOutputs,
    warnings,
    final_reading: finalReading,
  });

  const { data, error } = await supabase
    .from('unified_readings')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function upsertOracleModule({ userId, weekStart, moduleKey, moduleOutput }) {
  const payload = cleanPayload({
    user_id: userId,
    week_start: weekStart,
    module_key: moduleKey,
    module_output: moduleOutput,
    updated_at: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from('oracle_weekly_modules')
    .upsert(payload, { onConflict: 'user_id,week_start,module_key' })
    .select('*');

  if (error) throw error;
  return pickFirst(data);
}
