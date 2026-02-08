import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../MeuGrimorioPage.module.css';

function EmptyState() {
  return (
    <div className={styles.stateCard}>
      <p>Você ainda não tem leituras. Faça sua primeira agora.</p>
      <Link to="/tarot" className={styles.stateButton}>
        Fazer leitura agora
      </Link>
    </div>
  );
}

export default EmptyState;
