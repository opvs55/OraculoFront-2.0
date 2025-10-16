// src/components/ThreeCardLayout/ThreeCardLayout.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import { POSICOES_TRES_CARTAS } from '../../constants/tarotConstants';
import styles from './ThreeCardLayout.module.css';

function ThreeCardLayout({ cards, basePath }) {
  if (!cards || cards.length === 0) return null;

  // Garantimos que estamos trabalhando apenas com as 3 primeiras cartas
  const threeCards = cards.slice(0, 3);

  return (
    <div className={styles.layoutContainer}>
      {threeCards.map((card, index) => {
        const cardPath = `${basePath}/carta/${index + 1}`;
        
        return (
          <Link to={cardPath} key={card.id || index} className={styles.cardLink}>
            <div className={styles.cardPosition}>
              <Card cardData={card} positionName={POSICOES_TRES_CARTAS[index]} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ThreeCardLayout;