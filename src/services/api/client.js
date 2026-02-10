const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL;

if (!API_BASE_URL) {
  console.error('ERRO: A variável de ambiente VITE_API_BASE_URL não está definida.');
}

export const FRIENDLY_LLM_LOCATION_MESSAGE =
  'Nosso oráculo está ajustando a conexão da região. Tente novamente em instantes.';

const STATUS_CODE_TO_KEY = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Não foi possível validar os dados enviados.',
  UNAUTHORIZED: 'Sua sessão expirou. Faça login novamente para continuar.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  CONFLICT: 'Já existe um registro para esta operação.',
  INTERNAL_ERROR: 'Ocorreu um erro interno ao consultar o oráculo.',
  SERVICE_UNAVAILABLE: 'O serviço está temporariamente indisponível.',
  LLM_LOCATION_UNSUPPORTED: FRIENDLY_LLM_LOCATION_MESSAGE,
};

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.code = details.code;
    this.data = details.data;
  }
}

export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

const parseResponseBody = async (response) => response.json().catch(() => null);

function toApiError(status, data) {
  const normalizedCode = data?.code || STATUS_CODE_TO_KEY[status];
  const mappedMessage = ERROR_MESSAGES[normalizedCode] || data?.message || data?.error;

  return new ApiError(mappedMessage || `Erro no servidor (${status}).`, {
    status,
    code: normalizedCode,
    data,
  });
}

async function requestSingleEndpoint(endpoint, options = {}) {
  const response = await fetch(buildApiUrl(endpoint), options);
  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw toApiError(response.status, data);
  }

  return data;
}

function canTryFallback(error) {
  return [404, 405, 501].includes(error?.status);
}

export async function requestApi(endpoints, options = {}) {
  const candidates = Array.isArray(endpoints) ? endpoints : [endpoints];
  let lastError = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const endpoint = candidates[index];

    try {
      return await requestSingleEndpoint(endpoint, options);
    } catch (error) {
      lastError = error;
      const isLast = index === candidates.length - 1;

      if (!canTryFallback(error) || isLast) {
        throw error;
      }
    }
  }

  throw lastError || new ApiError('Falha desconhecida ao consultar API.');
}
