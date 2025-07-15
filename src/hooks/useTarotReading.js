// src/hooks/useTarotReading.js

import { useState, useCallback } from 'react';
import { sortearCruzCelta } from '../services/tarotService';
import { getInterpretation } from '../services/aiService'; // <-- A LINHA QUE FALTAVA

export function useTarotReading() {
  const [drawnCards, setDrawnCards] = useState([]);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReading = useCallback(async (question) => {
    setIsLoading(true);
    setDrawnCards([]);
    setAiInterpretation('');
    setError(null);
    console.log(`Hook: Gerando leitura para a pergunta: "${question}"`);

    try {
      const cards = sortearCruzCelta();
      setDrawnCards(cards);

      // Agora que a função foi importada, esta linha funcionará
      const interpretation = await getInterpretation(question, cards);
      console.log('INTERPRETAÇÃO RECEBIDA NO HOOK:', interpretation);
      setAiInterpretation(interpretation);

    } catch (err) {
      console.error("Hook: Erro ao gerar leitura", err);
      // Aqui usamos a mensagem de erro que veio do 'throw' no aiService
      setError(err.message || "Houve um erro ao realizar sua leitura. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    drawnCards,
    aiInterpretation,
    isLoading,
    error,
    generateReading,
  };
}