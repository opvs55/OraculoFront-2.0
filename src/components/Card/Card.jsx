// Card.jsx
import React from 'react';
import styles from './Card.module.css';

function Card({ cardData, positionName }) {
  const { nome, img, invertida } = cardData;
  const cardClassName = `${styles.card} ${invertida ? styles.inverted : ''}`;

  return (
    <div className={styles.cardContainer}>
      <img src={img} alt={nome} className={cardClassName} />
      <p className={styles.positionName}>{positionName}</p>
      <p className={styles.cardName}>{nome} {invertida ? '(Invertida)' : ''}</p>
    </div>
  );
}

export default Card;