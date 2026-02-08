const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;

export const normalizeIdentifier = (value) => value.trim();

export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const validateUsername = (value) => {
  if (!value) {
    return 'Informe um nome de usuário.';
  }

  if (!USERNAME_PATTERN.test(value)) {
    return 'Use 3-20 caracteres (letras, números, ponto, hífen ou sublinhado).';
  }

  return '';
};

export const validateEmail = (value) => {
  if (!value) {
    return 'Informe um e-mail.';
  }

  if (!isEmail(value)) {
    return 'O formato do e-mail é inválido.';
  }

  return '';
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Informe uma senha.';
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return '';
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Confirme sua senha.';
  }

  if (password !== confirmPassword) {
    return 'As senhas não correspondem.';
  }

  return '';
};

export const MIN_PASSWORD_LENGTH_VALUE = MIN_PASSWORD_LENGTH;
