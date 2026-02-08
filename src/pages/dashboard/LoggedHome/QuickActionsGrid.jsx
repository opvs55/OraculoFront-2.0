import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../MeuGrimorioPage.module.css';

function QuickActionsGrid() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Ações rápidas</h2>
      <div className={styles.actionsGrid}>
        <article className={`${styles.actionCard} ${styles.actionPrimary}`}>
          <div className={styles.actionIcon}>✨</div>
          <h3>Fazer leitura</h3>
          <p>Abra um novo portal e receba sua mensagem agora.</p>
          <Link to="/tarot" className={styles.actionButtonPrimary}>
            Iniciar leitura
          </Link>
        </article>

        <article className={styles.actionCard}>
          <div className={styles.actionIcon}>🔢</div>
          <h3>Numerologia</h3>
          <p>Explore números que revelam ciclos e padrões pessoais.</p>
          <Link to="/numerologia" className={styles.actionButtonSecondary}>
            Ver numerologia
          </Link>
        </article>

        <article className={styles.actionCard}>
          <div className={styles.actionIcon}>📚</div>
          <h3>Biblioteca</h3>
          <p>Consulte cartas e conteúdos para aprofundar sua jornada.</p>
          <Link to="/biblioteca" className={styles.actionButtonTertiary}>
            Explorar biblioteca
          </Link>
        </article>

        <article className={styles.actionCard}>
          <div className={styles.actionIcon}>🪐</div>
          <h3>Mapa Astral</h3>
          <p>Receba um resumo simbólico do seu mapa com foco semanal.</p>
          <Link to="/mapa-astral" className={styles.actionButtonSecondary}>
            Gerar mapa astral
          </Link>
        </article>
      </div>
    </section>
  );
}

export default QuickActionsGrid;
