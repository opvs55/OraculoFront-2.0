// src/services/tarotService.js
import { baralho } from '../tarotDeck.js'; // Note o caminho atualizado

// Função para embaralhar um array usando o algoritmo Fisher-Yates
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Sorteia 10 cartas do baralho para uma leitura da Cruz Celta.
 * @returns {Array<Object>} Um array com 10 objetos de carta, cada um com sua orientação.
 */
export function sortearCruzCelta() {
  console.log("Serviço de tarot: Sorteando cartas...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 10);

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}