import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeDate } from '../../../utils/formatRelativeDate';
import { getQuestionText } from '../../../utils/getQuestionText';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import styles from '../MeuGrimorioPage.module.css';

const spreadLabels = {
  celticCross: 'Cruz Celta',
  threeCards: '3 Cartas',
  templeOfAphrodite: 'Templo de Afrodite',
  pathChoice: 'Escolha de Caminho',
  oneCard: 'Uma Carta',
};

function ContinueReadingSection({ readings, isLoading, isError, onRetry }) {
  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
        <LoadingSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
        <ErrorState onRetry={onRetry} />
      </section>
    );
  }

  if (!readings.length) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
        <EmptyState />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
        <Link to="/meu-grimorio" className={styles.sectionLink}>
          Ver histórico completo
        </Link>
      </div>

      <div className={styles.readingsGrid}>
        {readings.map((reading) => (
          <article key={reading.id} className={styles.readingCard}>
            <div>
              <h3 className={styles.readingTitle}>
                {reading.shared_title
                  || getQuestionText(reading.question, reading.spread_type)
                  || 'Leitura sem título'}
              </h3>
              <div className={styles.readingMeta}>
                <span>{formatRelativeDate(reading.created_at)}</span>
                <span>{spreadLabels[reading.spread_type] || reading.spread_type}</span>
                <span>{reading.is_public ? 'Pública' : 'Privada'}</span>
              </div>
            </div>
            <Link to={`/leitura/${reading.id}`} className={styles.readingButton}>
              Retomar
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ContinueReadingSection;
