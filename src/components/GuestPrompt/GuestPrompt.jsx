// src/components/GuestPrompt/GuestPrompt.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestPrompt.module.css';

function GuestPrompt() {
  return (
    <div className={styles.promptContainer}>
      <h3 className={styles.title}>Gostou da sua leitura?</h3>
      <p className={styles.text}>
        Crie uma conta ou faça login para salvar esta leitura em seu diário pessoal e acompanhar sua jornada de autoconhecimento.
      </p>
      <div className={styles.buttonGroup}>
        <Link to="/cadastro" className={`${styles.button} ${styles.primary}`}>
          Criar Conta Gratuitamente
        </Link>
        <Link to="/login" className={styles.button}>
          Já tenho conta (Entrar)
        </Link>
      </div>
    </div>
  );
}

export default GuestPrompt;