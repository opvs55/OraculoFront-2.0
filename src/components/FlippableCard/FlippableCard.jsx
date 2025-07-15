// src/components/FlippableCard/FlippableCard.jsx

import React from 'react';
import styles from './FlippableCard.module.css';

// Este componente recebe a imagem da frente, do verso, e se deve estar virada ou não
function FlippableCard({ isFlipped, frontImage, backImage, cardName }) {
  return (
    <div className={styles.cardScene}>
      <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>
        <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
          <img src={frontImage} alt={cardName} />
        </div>
        <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
          <img src={backImage} alt="Verso da Carta" />
        </div>
      </div>
    </div>
  );
}

export default FlippableCard;