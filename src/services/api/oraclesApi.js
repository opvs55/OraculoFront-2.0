import { supabase } from '../../supabaseClient';
import { requestApi } from './client';
import { API_V1_ENDPOINTS, resolveEndpointSequence } from './endpoints';

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token
    ? {
        Authorization: `Bearer ${session.access_token}`,
      }
    : {};
}

async function postJson(endpointKey, payload, { withAuth = false } = {}) {
  const authHeaders = withAuth ? await getAuthHeaders() : {};

  return requestApi(resolveEndpointSequence(endpointKey), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}

export const oraclesApi = {
  createTarotReading(payload) {
    return postJson('tarotReadings', payload);
  },

  chatTarot(payload) {
    return postJson('tarotChat', payload);
  },

  getTarotCardMeaning(payload) {
    return postJson('tarotCardMeaning', payload);
  },

  getPersonalNumerology(payload) {
    return postJson('numerologyPersonal', payload, { withAuth: true });
  },

  getWeeklyNumerology(payload) {
    return postJson('numerologyWeekly', payload, { withAuth: true });
  },

  getNatalChart(payload) {
    return postJson('astrologyNatalChart', payload, { withAuth: true });
  },

  getRunesReading(payload) {
    return postJson('runesReadings', payload, { withAuth: true });
  },

  getIChingReading(payload) {
    return postJson('iChingReadings', payload, { withAuth: true });
  },

  createUnifiedReading(payload) {
    return postJson('unifiedReadings', payload, { withAuth: true });
  },

  getUnifiedReadingById(readingId) {
    return requestApi(`${API_V1_ENDPOINTS.unifiedReadings}/${readingId}`, {
      method: 'GET',
    });
  },
};
