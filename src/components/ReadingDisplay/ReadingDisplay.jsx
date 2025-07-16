// src/components/ReadingDisplay/ReadingDisplay.jsx - VERSÃO COM DESTAQUE DURANTE A DIGITAÇÃO

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import styles from './ReadingDisplay.module.css';

const STATUS = {
  INITIALIZING: 'INITIALIZING',
  TYPING: 'TYPING',
  WAITING: 'WAITING',
  COMPLETE: 'COMPLETE',
};

function ReadingDisplay({ text, readingId }) {
  const allParagraphs = useMemo(() => {
    if (!text) return [];
    return text.split('\n').filter(p => p.trim() !== '');
  }, [text]);

  const [status, setStatus] = useState(STATUS.INITIALIZING);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  
  const paragraphsToShow = useMemo(() => {
    if (status === STATUS.TYPING) {
      return allParagraphs.slice(0, revealedIndex);
    }
    return allParagraphs.slice(0, revealedIndex + 1);
  }, [status, revealedIndex, allParagraphs]);

  const storageKey = `reading-progress-${readingId}`;

  const handleTypingComplete = useCallback(() => {
    localStorage.setItem(storageKey, revealedIndex.toString());
    if (revealedIndex >= allParagraphs.length - 1) {
      setStatus(STATUS.COMPLETE);
    } else {
      setStatus(STATUS.WAITING);
    }
  }, [storageKey, revealedIndex, allParagraphs]);

  const textToType = status === STATUS.TYPING ? allParagraphs[revealedIndex] : '';
  const typedText = useTypewriter(textToType, 40, handleTypingComplete);
  
  useEffect(() => {
    const savedIndexStr = localStorage.getItem(storageKey);
    
    if (savedIndexStr === null) {
      if (allParagraphs.length > 0) {
        setRevealedIndex(0);
        setStatus(STATUS.TYPING);
      } else {
        setStatus(STATUS.COMPLETE);
      }
    } else {
      const savedIndex = parseInt(savedIndexStr, 10);
      setRevealedIndex(savedIndex);
      
      if (savedIndex >= allParagraphs.length - 1) {
        setStatus(STATUS.COMPLETE);
      } else {
        setStatus(STATUS.WAITING);
      }
    }
  }, [allParagraphs, storageKey]);

  const handleContinue = () => {
    if (status === STATUS.WAITING) {
      setRevealedIndex(prev => prev + 1);
      setStatus(STATUS.TYPING);
    }
  };

  const renderTextWithHighlights = (paragraphText) => {
    const regex = /\*\*([^*]+)\*\*/g;
    const parts = paragraphText.split(regex);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className={styles.cardNameHighlight}>{part}</span>;
      }
      return part;
    });
  };

  if (status === STATUS.INITIALIZING) {
    return <div className={styles.container}><p>Carregando diálogo...</p></div>;
  }
  
  const isTyping = status === STATUS.TYPING;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Diálogo com as Cartas</h2>
      <div className={styles.content}>
        {paragraphsToShow.map((p, index) => (
          <p key={index}>{renderTextWithHighlights(p)}</p>
        ))}

        {/* --- A MUDANÇA ESTÁ AQUI --- */}
        {isTyping && (
          <p className={styles.typingParagraph}>
            {/* Agora, aplicamos a função de destaque diretamente no texto que está sendo digitado */}
            {renderTextWithHighlights(typedText)}
            <span className={styles.cursor}></span>
          </p>
        )}

        {status === STATUS.WAITING && (
          <div className={styles.prompt}>
            <p>Deseja continuar?</p>
            <button onClick={handleContinue} className={styles.promptButton}>Sim</button>
          </div>
        )}

        {status === STATUS.COMPLETE && (
          <div className={styles.finalMessage}>
            <p>É isto que as cartas nos trouxeram hoje.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingDisplay;