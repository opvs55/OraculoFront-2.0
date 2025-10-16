import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CardPreview.module.css';

function CardPreview({ card }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/biblioteca/${card.slug}`} 
      className={styles.cardLink}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.mediaContainer}>
        {isHovered && card.video ? (
          <video
            key={card.id}
            className={styles.cardMedia}
            autoPlay
            loop
            muted
            playsInline
            src={card.video}
          />
        ) : (
          <img 
            src={card.img} 
            alt={card.nome} 
            className={styles.cardMedia} 
          />
        )}
      </div>
      <p className={styles.cardName}>{card.nome}</p>
    </Link>
  );
}

export default CardPreview;