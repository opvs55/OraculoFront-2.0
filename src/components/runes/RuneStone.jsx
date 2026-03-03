import React from 'react';
import { resolveRune } from '../../constants/runes';
import styles from './RuneStone.module.css';

const POSITION_LABELS = {
  passado: 'Passado',
  presente: 'Presente',
  futuro: 'Futuro',
};

function normalizePosition(position) {
  return String(position || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function RuneStone({ rune, position, delayMs = 0 }) {
  const resolvedRune = resolveRune(rune?.key || rune?.name || rune?.symbol || rune);
  const safePosition = normalizePosition(position);
  const positionLabel = POSITION_LABELS[safePosition] || 'Posição';

  return (
    <article className={styles.runeStone} style={{ '--delay': `${delayMs}ms` }}>
      <span className={styles.positionBadge}>{positionLabel}</span>
      <div className={styles.runeSymbol}>{resolvedRune?.symbol || '✶'}</div>
      <h3 className={styles.runeName}>{resolvedRune?.name || 'Runa desconhecida'}</h3>
      <p className={styles.runeKeywords}>
        {resolvedRune?.keywords?.join(' • ') || 'Aguardando interpretação oracular.'}
      </p>
    </article>
  );
}

export default RuneStone;
