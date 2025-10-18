import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

function WelcomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* Podemos adicionar uma imagem de fundo ou textura aqui */}
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>EXOTERICON</h1>
        <p className={styles.subtitle}>
          Um portal para desvendar os mistérios do oculto. Explore oráculos, grimórios e sabedorias ancestrais.
        </p>
        
        {/* Adicionaremos mais links/seções aqui no futuro */}
        
        <Link to="/tarot" className={styles.ctaButton}>
          Consultar o Oráculo de Tarot
        </Link>
        <Link to="/biblioteca" className={styles.secondaryLink}>
          Explorar a Biblioteca de Cartas
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;