// src/hooks/useTypewriter.js - VERSÃO REFINADA E CORRIGIDA

import { useState, useEffect } from 'react';

/**
 * Hook customizado que simula um efeito de digitação.
 * @param {string} text - O texto a ser digitado.
 * @param {number} speed - A velocidade da digitação em ms.
 * @param {function} onComplete - Callback executado ao final.
 */
export function useTypewriter(text, speed = 50, onComplete) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    // Se não houver texto para digitar, reseta e não faz nada.
    if (!text) {
      setTypedText('');
      return;
    }

    setTypedText(''); // Garante que começamos do zero
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        // Chama o callback de conclusão, se ele existir
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    // A função de limpeza é crucial. Ela roda quando o componente
    // é desmontado ou quando o 'text' muda, evitando vazamentos de memória.
    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed, onComplete]); // O efeito depende dessas props

  // O hook agora só precisa retornar o texto sendo digitado.
  return typedText;
}