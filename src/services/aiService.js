// src/services/aiService.js

// Lemos a URL do nosso backend a partir da variável de ambiente.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Verificação para ajudar a evitar erros durante o desenvolvimento
if (!BACKEND_URL) {
  console.error("ERRO: A variável de ambiente VITE_BACKEND_URL não está definida.");
  // Em um app real, você poderia lançar um erro ou ter um valor padrão
  // throw new Error("A variável de ambiente VITE_BACKEND_URL não está definida.");
}

/**
 * Envia a pergunta e as cartas para o nosso backend dedicado para obter a interpretação da IA.
 * @param {string} question A pergunta do usuário.
 * @param {Array<Object>} cards O array de cartas sorteadas.
 * @returns {Promise<Object>} Um objeto contendo { mainInterpretation, cardInterpretations }.
 */
export async function getInterpretation(question, cards) {
  // O endpoint agora é a URL completa do seu servidor + a nossa rota de tarot.
  const API_ENDPOINT = `${BACKEND_URL}/api/tarot`;

  console.log('aiService: Chamando o endpoint externo:', API_ENDPOINT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, cards }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Erro no servidor: ${response.statusText}` }));
      throw new Error(errorData.error);
    }

    const data = await response.json();

    // Retornamos o objeto de dados completo, que o nosso Context espera.
    // Ele contém tanto a 'mainInterpretation' quanto o array 'cardInterpretations'.
    return data;

  } catch (error) {
    console.error('Erro no aiService ao chamar o backend:', error);
    // Propaga o erro para que o hook possa capturá-lo e mostrar ao usuário
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