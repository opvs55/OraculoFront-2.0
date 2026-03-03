import React from 'react';
import RuneStone from './RuneStone';
import styles from './RunesCast.module.css';

const FALLBACK_POSITIONS = ['passado', 'presente', 'futuro'];

function normalizePosition(position) {
  return String(position || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeRunes(runes = []) {
  const list = Array.isArray(runes) ? runes.slice(0, 3) : [];

  return FALLBACK_POSITIONS.map((fallbackPosition, index) => {
    const item = list[index];

    if (item == null) {
      return { position: fallbackPosition, rune: null };
    }

    if (typeof item === 'string') {
      return { position: fallbackPosition, rune: item };
    }

    return {
      position: normalizePosition(item.position) || fallbackPosition,
      rune: item.key || item.name || item.symbol || item,
    };
  });
}

function RunesCast({ runes = [] }) {
  const normalized = normalizeRunes(runes);

  return (
    <section className={styles.castGrid} aria-label="Runas semanais: passado, presente e futuro">
      {normalized.map((item, index) => (
        <RuneStone
          key={`${item.position}-${index}`}
          rune={item.rune}
          position={item.position}
          delayMs={index * 140}
        />
      ))}
    </section>
  );
}

export default RunesCast;
