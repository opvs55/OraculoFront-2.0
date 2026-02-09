// src/services/apiClient.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL;

if (!API_BASE_URL) {
  console.error('ERRO: A variável de ambiente VITE_API_BASE_URL não está definida.');
}

const useApiV1 = String(import.meta.env.VITE_USE_API_V1 || '').toLowerCase() === 'true';

const LLM_LOCATION_UNSUPPORTED_MESSAGE =
  'O serviço de IA ainda não está disponível na sua localização. Tente novamente em alguns instantes.';

export const API_ENDPOINTS = {
  tarotReading: useApiV1 ? '/api/v1/tarot/readings' : '/api/tarot',
  tarotChat: useApiV1 ? '/api/v1/tarot/chat' : '/api/tarot/chat',
  tarotCardMeaning: useApiV1 ? '/api/v1/tarot/cards/meaning' : '/api/tarot/card-meaning',
  numerologyReading: useApiV1 ? '/api/v1/numerology/readings' : '/api/numerology',
  numerologyReset: useApiV1 ? '/api/v1/numerology/readings/current' : '/api/numerology/reset',
  oraclesWeeklyReading: useApiV1 ? '/api/v1/oracles/weekly-reading' : '/api/oracles/weekly-reading',
  astrologyWeeklyTheme: useApiV1 ? '/api/v1/astrology/weekly-theme' : '/api/astral-chart',
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  useApiV1,
};

export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export const parseApiResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 503 && data?.code === 'LLM_LOCATION_UNSUPPORTED') {
      throw new Error(LLM_LOCATION_UNSUPPORTED_MESSAGE);
    }

    const message = data?.message || data?.error || `Erro no servidor: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const requestApi = async (endpoint, options = {}) => {
  const response = await fetch(buildApiUrl(endpoint), options);
  return parseApiResponse(response);
};
