// src/components/CelticCrossLayout/CelticCrossLayout.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import { POSICOES_CRUZ_CELTA } from '../../constants/tarotConstants';
import styles from './CelticCrossLayout.module.css';

// A função agora aceita a prop 'basePath' para criar links dinâmicos
function CelticCrossLayout({ cards, basePath = '/resultado' }) {
  
  if (!cards || cards.length === 0) return null;

  return (
    <div className={styles.gridContainer}>
      {cards.map((card, index) => {
        const cardPath = `${basePath}/carta/${index + 1}`;
        
        return (
          // O link agora é construído dinamicamente
          <Link to={cardPath} key={card.id || index} className={styles.cardLink}>
            <div className={`${styles.cardPosition} ${styles[`position${index + 1}`]}`}>
              <Card cardData={card} positionName={POSICOES_CRUZ_CELTA[index]} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default CelticCrossLayout;