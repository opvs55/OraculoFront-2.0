// src/components/QuestionForm/QuestionForm.jsx
import React, { useState } from 'react';
import styles from './QuestionForm.module.css';

function QuestionForm({ onSubmit, disabled }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    if (!question.trim()) {
      alert('Por favor, digite sua pergunta antes de continuar.');
      return;
    }
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        className={styles.textarea}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Digite sua pergunta aqui..."
        disabled={disabled}
        rows="3"
      />
      <button type="submit" className={styles.button} disabled={disabled}>
        {disabled ? 'Sorteando Cartas...' : 'Revelar Minha Leitura'}
      </button>
    </form>
  );
}

export default QuestionForm;