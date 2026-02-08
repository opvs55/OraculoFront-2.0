import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../MeuGrimorioPage.module.css';

function LoggedHeroCard({ displayName, lastReadingLabel, cardOfTheWeek, publicReadingsCount }) {
  return (
    <section className={styles.heroCard}>
      <div className={styles.heroHeader}>
        <div>
          <p className={styles.heroEyebrow}>Seu dashboard pessoal</p>
          <h1 className={styles.heroTitle}>Bem-vindo de volta, {displayName}</h1>
          <p className={styles.heroSubtitle}>Pronto para sua leitura de hoje?</p>
        </div>
        <div className={styles.heroCtaBlock}>
          <Link to="/tarot" className={styles.heroPrimaryButton}>
            Fazer leitura agora
          </Link>
          <span className={styles.heroMicrocopy}>Leva ~3 min</span>
        </div>
      </div>

      <div className={styles.quickStatus}>
        <span>Última leitura: {lastReadingLabel}</span>
        <span>Carta da semana: {cardOfTheWeek}</span>
        {publicReadingsCount !== undefined && (
          <span>Leituras públicas: {publicReadingsCount}</span>
        )}
      </div>

      <div className={styles.heroSecondaryActions}>
        <Link to="/numerologia" className={styles.heroSecondaryButton}>
          Análise Numerológica
        </Link>
        <Link to="/biblioteca" className={styles.heroSecondaryButton}>
          Biblioteca de Cartas
        </Link>
      </div>
    </section>
  );
}

export default LoggedHeroCard;
