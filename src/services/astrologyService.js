import { API_ENDPOINTS, requestApi } from './apiClient';

export async function getAstralChart(payload, options = {}) {
  const API_ENDPOINT = API_ENDPOINTS.astrologyWeeklyTheme;
  const method = options.method || 'POST';

  console.log('astrologyService: Chamando o endpoint externo:', API_ENDPOINT);

  try {
    return await requestApi(API_ENDPOINT, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? undefined : JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Erro no astrologyService ao chamar o backend:', error);
    throw error;
  }
}
