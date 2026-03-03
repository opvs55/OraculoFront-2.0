const RAW_RUNES = {
  fehu: { symbol: 'ᚠ', name: 'Fehu', keywords: ['prosperidade', 'abundância', 'recursos'] },
  uruz: { symbol: 'ᚢ', name: 'Uruz', keywords: ['força', 'vitalidade', 'coragem'] },
  thurisaz: { symbol: 'ᚦ', name: 'Thurisaz', keywords: ['proteção', 'limites', 'ruptura'] },
  ansuz: { symbol: 'ᚨ', name: 'Ansuz', keywords: ['mensagem', 'sabedoria', 'comunicação'] },
  raidho: { symbol: 'ᚱ', name: 'Raidho', keywords: ['jornada', 'movimento', 'direção'] },
  kenaz: { symbol: 'ᚲ', name: 'Kenaz', keywords: ['clareza', 'foco', 'criatividade'] },
  gebo: { symbol: 'ᚷ', name: 'Gebo', keywords: ['troca', 'parceria', 'equilíbrio'] },
  wunjo: { symbol: 'ᚹ', name: 'Wunjo', keywords: ['alegria', 'harmonia', 'gratidão'] },
  hagalaz: { symbol: 'ᚺ', name: 'Hagalaz', keywords: ['mudança', 'quebra', 'transformação'] },
  nautiz: { symbol: 'ᚾ', name: 'Nauthiz', keywords: ['necessidade', 'resiliência', 'disciplina'] },
  isa: { symbol: 'ᛁ', name: 'Isa', keywords: ['pausa', 'silêncio', 'interiorização'] },
  jera: { symbol: 'ᛃ', name: 'Jera', keywords: ['colheita', 'ciclos', 'resultado'] },
  eihwaz: { symbol: 'ᛇ', name: 'Eihwaz', keywords: ['resistência', 'eixo', 'transição'] },
  perthro: { symbol: 'ᛈ', name: 'Perthro', keywords: ['mistério', 'destino', 'revelação'] },
  algiz: { symbol: 'ᛉ', name: 'Algiz', keywords: ['amparo', 'proteção', 'instinto'] },
  sowilo: { symbol: 'ᛋ', name: 'Sowilo', keywords: ['sol', 'êxito', 'vitalidade'] },
  tiwaz: { symbol: 'ᛏ', name: 'Tiwaz', keywords: ['justiça', 'honra', 'disciplina'] },
  berkanan: { symbol: 'ᛒ', name: 'Berkanan', keywords: ['nascimento', 'nutrição', 'cura'] },
  ehwaz: { symbol: 'ᛖ', name: 'Ehwaz', keywords: ['parceria', 'avanço', 'confiança'] },
  mannaz: { symbol: 'ᛗ', name: 'Mannaz', keywords: ['humanidade', 'cooperação', 'consciência'] },
  laguz: { symbol: 'ᛚ', name: 'Laguz', keywords: ['intuição', 'fluxo', 'emocional'] },
  ingwaz: { symbol: 'ᛜ', name: 'Ingwaz', keywords: ['potencial', 'gestação', 'descanso'] },
  dagaz: { symbol: 'ᛞ', name: 'Dagaz', keywords: ['despertar', 'virada', 'luz'] },
  othala: { symbol: 'ᛟ', name: 'Othala', keywords: ['ancestralidade', 'lar', 'legado'] },
};

export const RUNES = RAW_RUNES;

const aliases = {
  nauthiz: 'nautiz',
  perth: 'perthro',
  berkano: 'berkanan',
  othila: 'othala',
  odal: 'othala',
};

export function normalizeRuneKey(input) {
  if (input == null) return '';
  const normalized = String(input)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  return aliases[normalized] || normalized;
}

export function resolveRune(input) {
  if (!input && input !== 0) return null;

  if (typeof input === 'object') {
    const candidate = input.key || input.name || input.symbol;
    return resolveRune(candidate);
  }

  const key = normalizeRuneKey(input);
  if (RUNES[key]) {
    return { key, ...RUNES[key] };
  }

  const byName = Object.entries(RUNES).find(([, rune]) => normalizeRuneKey(rune.name) === key);
  if (byName) {
    return { key: byName[0], ...byName[1] };
  }

  const bySymbol = Object.entries(RUNES).find(([, rune]) => rune.symbol === String(input).trim());
  if (bySymbol) {
    return { key: bySymbol[0], ...bySymbol[1] };
  }

  return null;
}
