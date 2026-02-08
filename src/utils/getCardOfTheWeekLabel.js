import { baralhoDetalhado } from '../tarotDeck';

export const getCardOfTheWeekLabel = (cardValue) => {
  if (!cardValue) return 'Ainda não definida';
  if (typeof cardValue === 'string') return cardValue;
  if (typeof cardValue === 'object') {
    const name = cardValue.name || cardValue.nome;
    if (name) return name;
    if (cardValue.id !== undefined) {
      const found = baralhoDetalhado.find((card) => card.id === cardValue.id);
      return found?.nome || 'Carta da semana';
    }
  }
  return 'Carta da semana';
};
