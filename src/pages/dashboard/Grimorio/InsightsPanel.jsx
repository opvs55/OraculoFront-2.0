import React from 'react';
import styles from '../MeuGrimorioPage.module.css';

export default function InsightsPanel({ insights, isLoading, variant = 'panel' }) {
  const content = (
    <div className={styles.insightsContent}>
      {isLoading && <p className={styles.insightsPlaceholder}>Tecendo padrões...</p>}
      {!isLoading && insights && (
        <>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Frequência (4 semanas)</span>
            <strong>{insights.frequencyPerWeek}/semana</strong>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Carta mais recorrente</span>
            <strong>{insights.topCard || '—'}</strong>
          </div>
        </>
      )}
      {!isLoading && !insights && (
        <div className={styles.insightsPlaceholder}>
          <p>Em breve: padrões do seu grimório.</p>
          <p>Use títulos e notas para fortalecer seus sinais.</p>
        </div>
      )}
    </div>
  );

  if (variant === 'accordion') {
    return (
      <details className={styles.insightsAccordion}>
        <summary className={styles.insightsSummary}>Insights do Grimório</summary>
        {content}
      </details>
    );
  }

  return (
    <aside className={styles.insightsPanel}>
      <h3 className={styles.insightsTitle}>Insights do Grimório</h3>
      {content}
    </aside>
  );
}
