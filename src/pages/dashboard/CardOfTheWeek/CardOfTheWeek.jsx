import React from 'react';
import styles from './CardOfTheWeek.module.css';
import { versoCartaImg } from '../../../tarotDeck'; // Importa o verso da carta

function CardOfTheWeek({ cardData, onReveal, revealAllowed }) {
  // Se ainda não temos os dados da carta, mostramos o verso e o botão
  if (!cardData) {
    return (
      <div className={`${styles.cardContainer} ${styles.cardBack}`}>
        <h2>Sua Carta da Semana</h2>
        <img src={versoCartaImg} alt="Verso da Carta" className={styles.cardImageBack} />
        {revealAllowed ? (
          <button onClick={onReveal} className={styles.revealButton}>
            Revelar Minha Carta
          </button>
        ) : (
          <p className={styles.waitMessage}>Volte na próxima semana para uma nova carta.</p> 
        )}
      </div>
    );
  }

  // Se já temos os dados, mostramos a carta revelada
  const { nome, img, significados, slug } = cardData;
  return (
    <div className={styles.cardContainer}>
      <h2>Sua Carta da Semana</h2>
      <img src={img} alt={nome} className={styles.cardImageFront} />
      <h3>{nome}</h3>
      <p className={styles.cardMeaning}>
        {/* Mostra um trecho do significado direito */}
        {significados.direito.substring(0, 150)}...
      </p>
      {/* Link para a página completa da carta na biblioteca */}
      <a href={`/biblioteca/${slug}`} className={styles.detailsLink}>
        Ver Significado Completo
      </a>
    </div>
  );
}

export default CardOfTheWeek;