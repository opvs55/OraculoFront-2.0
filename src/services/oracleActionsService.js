import { oraclesApi } from './api/oraclesApi';
import {
  saveOrGetPersonalNumerology as repoSaveOrGetPersonalNumerology,
  saveOrGetNatalChart as repoSaveOrGetNatalChart,
  upsertWeeklyNumerology as repoUpsertWeeklyNumerology,
  insertUnifiedReading,
} from './supabase/oraclesRepo';

export async function saveOrGetPersonalNumerology(payload) {
  const apiData = await oraclesApi.getPersonalNumerology(payload);

  return repoSaveOrGetPersonalNumerology({
    userId: payload.userId,
    payload: {
      input_birth_date: payload.birthDate,
      ...apiData,
    },
  });
}

export async function saveOrGetNatalChart(payload) {
  const apiData = await oraclesApi.getNatalChart(payload);

  return repoSaveOrGetNatalChart({
    userId: payload.user?.id || payload.userId,
    payload: {
      birth_date: payload?.user?.birth_date,
      birth_time: payload?.user?.birth_time,
      birth_city: payload?.user?.birth_city,
      chart_data: apiData,
    },
  });
}

export async function upsertWeeklyNumerology(payload) {
  const apiData = await oraclesApi.getWeeklyNumerology(payload);

  return repoUpsertWeeklyNumerology({
    userId: payload.userId,
    weekStart: payload.weekStart,
    readingData: apiData,
  });
}

export async function createUnifiedReading(payload) {
  const response = await oraclesApi.createUnifiedReading(payload);

  return insertUnifiedReading({
    userId: payload.userId,
    weekRef: payload.weekRef,
    inputPayload: payload,
    moduleOutputs: response?.module_outputs || response?.moduleOutputs,
    warnings: response?.warnings || [],
    finalReading: response?.final_reading || response?.finalReading || response,
  });
}

export async function getUnifiedReadingById(id) {
  return oraclesApi.getUnifiedReadingById(id);
}
