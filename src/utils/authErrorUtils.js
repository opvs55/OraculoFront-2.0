// src/utils/authErrorUtils.js

// Mapeia mensagens de erro comuns do Supabase Auth para português
const errorMessages = {
  // Erros de Cadastro (signUp)
  'User already registered': 'Este e-mail já está cadastrado.',
  'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
  'Unable to validate email address: invalid format': 'O formato do e-mail é inválido.',
  'Este nome de usuário já está em uso.': 'Este nome de usuário já está em uso.',
  // Erros de Login (signInWithPassword) - Mantemos genérico por segurança
  'Invalid login credentials': 'Nome de usuário ou senha inválidos.',
  // Erros de RPC (get_email_by_username) ou outros
  'Failed to fetch': 'Erro de conexão. Verifique sua internet.',
  // Mensagem padrão
  default: 'Ocorreu um erro inesperado. Tente novamente.',
};

/**
 * Traduz um objeto de erro do Supabase Auth para uma mensagem amigável.
 * @param {Error} error O objeto de erro do Supabase.
 * @returns {string} A mensagem de erro traduzida.
 */
export function translateSupabaseError(error) {
  if (!error || !error.message) {
    return errorMessages.default;
  }

  if (errorMessages[error.message]) {
    return errorMessages[error.message];
  }

  if (error.message.includes('rate limit')) {
    return 'Muitas tentativas. Por favor, aguarde um pouco.';
  }

  console.warn('Erro Supabase não traduzido:', error.message);
  return errorMessages.default;
}
