import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

function WelcomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* Podemos adicionar uma imagem de fundo ou textura aqui */}
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>ESOTERICON</h1>
        <p className={styles.subtitle}>
          Um portal para desvendar os mistérios do oculto. Explore oráculos, grimórios e sabedorias ancestrais.
        </p>
        
        {/* Adicionaremos mais links/seções aqui no futuro */}
        
        <Link to="/tarot" className={styles.ctaButton}>
          Consultar o Oráculo de Tarot
        </Link>

        {/* --- NOVO LINK ADICIONADO --- */}
        <Link 
          to="/numerologia" 
          className={`${styles.secondaryLink} ${styles.numerologyLink}`}
        >
          Analisar Meus Números
        </Link>
        {/* --- FIM DA ADIÇÃO --- */}
        
        <Link to="/biblioteca" className={styles.secondaryLink}>
          Explorar a Biblioteca de Cartas
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;