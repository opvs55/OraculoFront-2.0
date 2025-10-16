// src/services/aiService.js - VERSÃO COMPLETA E ATUALIZADA

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
  console.error("ERRO: A variável de ambiente VITE_BACKEND_URL não está definida.");
}

export async function getInterpretation(question, cards, spreadType) { // ALTERAÇÃO: Adicionamos spreadType aqui
  const API_ENDPOINT = `${BACKEND_URL}/api/tarot`;
  console.log('aiService: Chamando o endpoint externo:', API_ENDPOINT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ALTERAÇÃO: E enviamos o spreadType no corpo da requisição
      body: JSON.stringify({ question, cards, spreadType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Erro no servidor: ${response.statusText}` }));
      // A linha abaixo precisa ser ajustada para pegar a mensagem de erro correta
      throw new Error(errorData.message || errorData.error || `Erro no servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro no aiService ao chamar o backend:', error);
    throw error;
  }
}

export async function getChatResponse(userMessage, chatContext) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const API_ENDPOINT = `${BACKEND_URL}/api/tarot/chat`;

  console.log('aiService (chat): Chamando endpoint:', API_ENDPOINT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage, chatContext }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha na resposta do servidor de chat.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no serviço de chat:', error);
    throw error;
  }
}

export async function getDidacticMeaning(cardName, cardOrientation, positionName) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const API_ENDPOINT = `${BACKEND_URL}/api/tarot/card-meaning`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardName, cardOrientation, positionName }),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar o significado da carta.');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro no serviço de significado didático:', error);
    throw error;
  }
}