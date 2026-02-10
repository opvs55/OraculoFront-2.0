import { buildApiUrl, requestApi, FRIENDLY_LLM_LOCATION_MESSAGE } from './api/client';
import { API_V1_ENDPOINTS } from './api/endpoints';

export const API_ENDPOINTS = {
  tarotReading: API_V1_ENDPOINTS.tarotReadings,
  tarotChat: API_V1_ENDPOINTS.tarotChat,
  tarotCardMeaning: API_V1_ENDPOINTS.tarotCardMeaning,
  numerologyReading: API_V1_ENDPOINTS.numerologyPersonal,
  numerologyWeekly: API_V1_ENDPOINTS.numerologyWeekly,
  astrologyNatalChart: API_V1_ENDPOINTS.astrologyNatalChart,
  runesReading: API_V1_ENDPOINTS.runesReadings,
  iChingReading: API_V1_ENDPOINTS.iChingReadings,
  unifiedReadings: API_V1_ENDPOINTS.unifiedReadings,
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL,
  useApiV1: true,
};

export const parseApiResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const isLocationIssue = response.status === 503 && data?.code === 'LLM_LOCATION_UNSUPPORTED';
    throw new Error(isLocationIssue ? FRIENDLY_LLM_LOCATION_MESSAGE : data?.message || `Erro no servidor: ${response.status}`);
  }

  return response.json().catch(() => null);
};

export { buildApiUrl, requestApi };
