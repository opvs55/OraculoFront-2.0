// src/components/ReadingDisplay/ReadingDisplay.jsx
import React from 'react';
import styles from './ReadingDisplay.module.css';

function ReadingDisplay({ text }) {
  if (!text) {
    return null;
  }

  // A IA geralmente usa '\n' para parágrafos. Vamos transformar isso em tags <p>.
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>A Mensagem das Cartas</h2>
      <div className={styles.content}>
        {paragraphs.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
      </div>
    </div>
  );
}

export default ReadingDisplay;