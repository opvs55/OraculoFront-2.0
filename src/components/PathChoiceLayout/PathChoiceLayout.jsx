import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import { POSICOES_ESCOLHA_CAMINHO } from '../../constants/tarotConstants';
import styles from './PathChoiceLayout.module.css';

function PathChoiceLayout({ cards, basePath }) {
  if (!cards || cards.length < 8) return null;

  const path1Cards = cards.slice(0, 4);
  const path2Cards = cards.slice(4, 8);

  return (
    <div className={styles.layoutContainer}>
      {/* Coluna do Caminho 1 */}
      <div className={styles.pathColumn}>
        <h3 className={styles.pathTitle}>Caminho 1</h3>
        <div className={styles.cardsWrapper}>
          {path1Cards.map((card, index) => {
            const cardPath = `${basePath}/carta/${index + 1}`;
            return (
              <Link to={cardPath} key={`p1-${index}`} className={styles.cardLink}>
                <Card cardData={card} positionName={POSICOES_ESCOLHA_CAMINHO[index]} />
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Coluna do Caminho 2 */}
      <div className={styles.pathColumn}>
        <h3 className={styles.pathTitle}>Caminho 2</h3>
        <div className={styles.cardsWrapper}>
          {path2Cards.map((card, index) => {
            const cardPath = `${basePath}/carta/${index + 5}`; // Continua a contagem (5, 6, 7, 8)
            return (
              <Link to={cardPath} key={`p2-${index}`} className={styles.cardLink}>
                <Card cardData={card} positionName={POSICOES_ESCOLHA_CAMINHO[index]} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PathChoiceLayout;