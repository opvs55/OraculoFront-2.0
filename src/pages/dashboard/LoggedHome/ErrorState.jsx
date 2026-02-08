import React from 'react';
import styles from '../MeuGrimorioPage.module.css';

function ErrorState({ onRetry }) {
  return (
    <div className={styles.stateCard}>
      <p>Não foi possível carregar suas leituras recentes.</p>
      <button type="button" onClick={onRetry} className={styles.stateButton}>
        Tentar novamente
      </button>
    </div>
  );
}

export default ErrorState;
