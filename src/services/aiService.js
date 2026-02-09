// src/services/aiService.js - VERSÃO COMPLETA E ATUALIZADA

import { API_ENDPOINTS, requestApi } from './apiClient';

export async function getInterpretation(question, cards, spreadType) { // ALTERAÇÃO: Adicionamos spreadType aqui
  const API_ENDPOINT = API_ENDPOINTS.tarotReading;
  console.log('aiService: Chamando o endpoint externo:', API_ENDPOINT);

  try {
    return await requestApi(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ALTERAÇÃO: E enviamos o spreadType no corpo da requisição
      body: JSON.stringify({ question, cards, spreadType }),
    });
  } catch (error) {
    console.error('Erro no aiService ao chamar o backend:', error);
    throw error;
  }
}

export async function getChatResponse(userMessage, chatContext) {
  const API_ENDPOINT = API_ENDPOINTS.tarotChat;

  console.log('aiService (chat): Chamando endpoint:', API_ENDPOINT);

  try {
    return await requestApi(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage, chatContext }),
    });
  } catch (error) {
    console.error('Erro no serviço de chat:', error);
    throw error;
  }
}

export async function getDidacticMeaning(cardName, cardOrientation, positionName) {
  const API_ENDPOINT = API_ENDPOINTS.tarotCardMeaning;

  try {
    return await requestApi(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardName, cardOrientation, positionName }),
    });
  } catch (error) {
    console.error('Erro no serviço de significado didático:', error);
    throw error;
  }
}
