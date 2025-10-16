import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import { POSICOES_TEMPLO_AFRODITE } from '../../constants/tarotConstants';
import styles from './TempleOfAphroditeLayout.module.css';

function TempleOfAphroditeLayout({ cards, basePath }) {
  if (!cards || cards.length < 7) return null;

  return (
    <div className={styles.gridContainer}>
      {cards.slice(0, 7).map((card, index) => {
        const cardPath = `${basePath}/carta/${index + 1}`;
        
        return (
          <Link to={cardPath} key={card.id || index} className={`${styles.cardLink} ${styles[`position${index + 1}`]}`}>
            <Card cardData={card} positionName={POSICOES_TEMPLO_AFRODITE[index]} />
          </Link>
        );
      })}
    </div>
  );
}

export default TempleOfAphroditeLayout;