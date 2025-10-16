// src/services/tarotService.js

import { baralho } from '../tarotDeck.js';

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
  console.log("Serviço de tarot: Sorteando 10 cartas para a Cruz Celta...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 10);

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}

// NOVO: Função para o sorteio de 3 cartas
/**
 * Sorteia 3 cartas do baralho para uma leitura de Passado, Presente e Futuro.
 * @returns {Array<Object>} Um array com 3 objetos de carta, cada um com sua orientação.
 */
export function sortearTresCartas() {
  console.log("Serviço de tarot: Sorteando 3 cartas...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 3); // A única mudança é aqui

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}

// NOVO: Função para o sorteio de 1 carta (Bônus, para o futuro)
/**
 * Sorteia 1 carta do baralho para leituras simples (Amor, Conselho do Dia, etc.).
 * @returns {Array<Object>} Um array com 1 objeto de carta, com sua orientação.
 */
export function sortearUmaCarta() {
  console.log("Serviço de tarot: Sorteando 1 carta...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 1); // E aqui

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}

export function sortearTemploDeAfrodite() {
  console.log("Serviço de tarot: Sorteando 7 cartas para o Templo de Afrodite...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 7); // Sorteia 7 cartas

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}

// NOVO: Função para a Escolha de Caminho
export function sortearEscolhaDeCaminho() {
  console.log("Serviço de tarot: Sorteando 8 cartas para a Escolha de Caminho...");
  const baralhoEmbaralhado = embaralhar([...baralho]);
  const cartasSelecionadas = baralhoEmbaralhado.slice(0, 8); // Sorteia 8 cartas

  const resultadoFinal = cartasSelecionadas.map(carta => ({
    ...carta,
    invertida: Math.random() < 0.5,
  }));

  return resultadoFinal;
}