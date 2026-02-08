import React from 'react';
import styles from '../MeuGrimorioPage.module.css';

const spreadOptions = [
  { value: '', label: 'Todas as tiragens' },
  { value: 'oneCard', label: 'Uma carta' },
  { value: 'threeCards', label: '3 cartas' },
  { value: 'celticCross', label: 'Cruz Celta' },
  { value: 'templeOfAphrodite', label: 'Templo de Afrodite' },
  { value: 'pathChoice', label: 'Escolha de Caminho' },
];

const periodOptions = [
  { value: 'all', label: 'Todo o histórico' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'custom', label: 'Período personalizado' },
];

export default function GrimorioToolbar({
  searchTerm,
  onSearchChange,
  spreadType,
  onSpreadTypeChange,
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  privacy,
  onPrivacyChange,
  withComments,
  onWithCommentsChange,
  withStars,
  onWithStarsChange,
  totalCount,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarHeader}>
        <div>
          <p className={styles.toolbarEyebrow}>Arquivo vivo</p>
          <h2 className={styles.toolbarTitle}>Histórico do Grimório</h2>
        </div>
        <span className={styles.toolbarCount}>{totalCount} leituras</span>
      </div>

      <div className={styles.toolbarRow}>
        <label className={styles.toolbarField}>
          <span className={styles.toolbarLabel}>Buscar</span>
          <input
            type="search"
            className={styles.toolbarInput}
            placeholder="Pergunta, interpretação ou carta..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className={styles.toolbarField}>
          <span className={styles.toolbarLabel}>Tipo de tiragem</span>
          <select
            className={styles.toolbarSelect}
            value={spreadType}
            onChange={(event) => onSpreadTypeChange(event.target.value)}
          >
            {spreadOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.toolbarField}>
          <span className={styles.toolbarLabel}>Período</span>
          <select
            className={styles.toolbarSelect}
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.toolbarField}>
          <span className={styles.toolbarLabel}>Privacidade</span>
          <select
            className={styles.toolbarSelect}
            value={privacy}
            onChange={(event) => onPrivacyChange(event.target.value)}
          >
            <option value="">Todas</option>
            <option value="public">Públicas</option>
            <option value="private">Privadas</option>
          </select>
        </label>
      </div>

      {period === 'custom' && (
        <div className={styles.toolbarRow}>
          <label className={styles.toolbarField}>
            <span className={styles.toolbarLabel}>De</span>
            <input
              type="date"
              className={styles.toolbarInput}
              value={customRange.start || ''}
              onChange={(event) => onCustomRangeChange({ ...customRange, start: event.target.value })}
            />
          </label>
          <label className={styles.toolbarField}>
            <span className={styles.toolbarLabel}>Até</span>
            <input
              type="date"
              className={styles.toolbarInput}
              value={customRange.end || ''}
              onChange={(event) => onCustomRangeChange({ ...customRange, end: event.target.value })}
            />
          </label>
        </div>
      )}

      <div className={styles.toolbarRow}>
        <label className={styles.toolbarToggle}>
          <input
            type="checkbox"
            checked={withComments}
            onChange={(event) => onWithCommentsChange(event.target.checked)}
          />
          <span>Com comentários</span>
        </label>
        <label className={styles.toolbarToggle}>
          <input
            type="checkbox"
            checked={withStars}
            onChange={(event) => onWithStarsChange(event.target.checked)}
          />
          <span>Com estrelas</span>
        </label>
      </div>
    </div>
  );
}
