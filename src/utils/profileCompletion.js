export const REQUIRED_PROFILE_FIELDS = [
  'username',
  'full_name',
  'bio',
  'minha_historia',
  'entidade_cultuada',
  'avatar_url',
];

const hasValue = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return Boolean(value);
};

export const isProfileComplete = (profile) => {
  if (!profile) return false;
  return REQUIRED_PROFILE_FIELDS.every((field) => hasValue(profile[field]));
};

export const getMissingProfileFields = (profile, labels = {}) => {
  if (!profile) return REQUIRED_PROFILE_FIELDS.map((field) => labels[field] || field);
  return REQUIRED_PROFILE_FIELDS.filter((field) => !hasValue(profile[field]))
    .map((field) => labels[field] || field);
};
