// src/services/tarotService.js (VERSÃO REFATORADA)

import { baralhoDetalhado as baralho } from '../tarotDeck.js';

// Função para embaralhar um array usando o algoritmo Fisher-Yates
function embaralhar(array) {
  const shuffled = [...array]; // Cria uma cópia para não modificar o original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função auxiliar para pegar cartas
function getShuffledCards(count) {
  const baralhoEmbaralhado = embaralhar(baralho);
  return baralhoEmbaralhado.slice(0, count);
}

// Função auxiliar para atribuir inversão (para não repetir código)
function assignInversion(card) {
  return { ...card, invertida: Math.random() < 0.5 };
}

// --- Funções de Sorteio com a Posição Adicionada ---

export function sortearUmaCarta() {
  console.log("Serviço de tarot: Sorteando 1 carta...");
  const [carta] = getShuffledCards(1);
  return [{ ...assignInversion(carta), posicao: 'A Carta' }];
}

export function sortearTresCartas() {
  console.log("Serviço de tarot: Sorteando 3 cartas...");
  const [passado, presente, futuro] = getShuffledCards(3);
  return [
    { ...assignInversion(passado), posicao: 'Passado' },
    { ...assignInversion(presente), posicao: 'Presente' },
    { ...assignInversion(futuro), posicao: 'Futuro' },
  ];
}

export function sortearCruzCelta() {
  console.log("Serviço de tarot: Sorteando 10 cartas para a Cruz Celta...");
  const sorteadas = getShuffledCards(10);
  const posicoes = [
    'Situação Atual', 'Obstáculo', 'Base da Questão', 'Passado Recente',
    'Coroamento (Possível Futuro)', 'Futuro Próximo', 'O Consulente',
    'O Ambiente', 'Esperanças e Medos', 'Resultado Final'
  ];
  return sorteadas.map((carta, index) => ({
    ...assignInversion(carta),
    posicao: posicoes[index],
  }));
}

export function sortearTemploDeAfrodite() {
  console.log("Serviço de tarot: Sorteando 7 cartas para o Templo de Afrodite...");
  const sorteadas = getShuffledCards(7);
  const posicoes = [
    'Pilar 1: O Eu Interior', 'Pilar 2: O Outro', 'Viga 1: A Relação no Passado',
    'Viga 2: A Relação no Presente', 'O Altar: O Desafio Central',
    'A Oferenda: O que deve ser Cultivado', 'A Bênção de Afrodite: O Conselho Final'
  ];
  return sorteadas.map((carta, index) => ({
      ...assignInversion(carta),
      posicao: posicoes[index],
  }));
}

export function sortearEscolhaDeCaminho() {
  console.log("Serviço de tarot: Sorteando 8 cartas para a Escolha de Caminho...");
  const sorteadas = getShuffledCards(8);
  const posicoes = [
    'O Consulente', 'A Situação da Escolha', 'O Caminho da Luz: Opção 1',
    'O Caminho da Luz: Desfecho 1', 'O Caminho das Sombras: Opção 2',
    'O Caminho das Sombras: Desfecho 2', 'O Conselho do Oráculo', 'O Resultado Mais Provável'
  ];
  return sorteadas.map((carta, index) => ({
      ...assignInversion(carta),
      posicao: posicoes[index],
  }));
}