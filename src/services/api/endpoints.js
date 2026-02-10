const endpointConfig = {
  tarotReadings: {
    v1: '/api/v1/tarot/readings',
    legacy: '/api/tarot',
    fallback: true,
  },
  tarotChat: {
    v1: '/api/v1/tarot/chat',
    legacy: '/api/tarot/chat',
    fallback: true,
  },
  tarotCardMeaning: {
    v1: '/api/v1/tarot/cards/meaning',
    legacy: '/api/tarot/card-meaning',
    fallback: true,
  },
  numerologyPersonal: {
    v1: '/api/v1/numerology/personal',
    legacy: '/api/numerology',
    fallback: true,
  },
  numerologyWeekly: {
    v1: '/api/v1/numerology/weekly',
  },
  astrologyNatalChart: {
    v1: '/api/v1/astrology/natal-chart',
  },
  runesReadings: {
    v1: '/api/v1/oracles/runes/readings',
  },
  iChingReadings: {
    v1: '/api/v1/oracles/iching/readings',
  },
  unifiedReadings: {
    v1: '/api/v1/unified/readings',
  },
};

export const API_V1_ENDPOINTS = Object.fromEntries(
  Object.entries(endpointConfig).map(([key, value]) => [key, value.v1]),
);

export function resolveEndpointSequence(key) {
  const config = endpointConfig[key];

  if (!config) {
    throw new Error(`Endpoint não mapeado: ${key}`);
  }

  return [config.v1, ...(config.fallback && config.legacy ? [config.legacy] : [])];
}
