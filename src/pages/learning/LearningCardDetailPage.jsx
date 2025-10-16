import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { baralhoDetalhado } from '../../tarotDeck';
import styles from './LearningCardDetailPage.module.css';

function LearningCardDetailPage() {
  // 1. Pega o 'slug' da carta pela URL (ex: "o-mago")
  const { cardSlug } = useParams();

  // 2. Encontra os dados da carta correspondente no nosso baralho detalhado
  const card = baralhoDetalhado.find(c => c.slug === cardSlug);

  // 3. Se a carta não for encontrada, mostra uma mensagem de erro
  if (!card) {
    return (
      <div className={`content_wrapper ${styles.notFound}`}>
        <h1>Carta não encontrada</h1>
        <p>A carta que você está procurando não existe. Por favor, volte para a biblioteca.</p>
        <Link to="/biblioteca" className={styles.backLink}>Voltar para a Biblioteca</Link>
      </div>
    );
  }

  return (
    <div className={`content_wrapper ${styles.pageContainer}`}>
      <div className={styles.header}>
        <h1 className={styles.cardName}>{card.nome}</h1>
        <p className={styles.cardType}>{card.tipo}{card.naipe ? ` - ${card.naipe}` : ''}</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <img src={card.img} alt={card.nome} className={styles.cardImage} />
        </div>
        <div className={styles.textContainer}>
          <p className={styles.description}>{card.descricao}</p>

          <div className={styles.keywords}>
            <div className={styles.keywordSection}>
              <h3 className={styles.keywordTitle}>Palavras-Chave (Direito)</h3>
              <ul>
                {card.palavras_chave.direito.map((keyword, index) => <li key={index}>{keyword}</li>)}
              </ul>
            </div>
            <div className={styles.keywordSection}>
              <h3 className={styles.keywordTitle}>Palavras-Chave (Invertido)</h3>
              <ul>
                {card.palavras_chave.invertido.map((keyword, index) => <li key={index}>{keyword}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.meaningsSection}>
        <div className={styles.meaning}>
          <h2 className={styles.meaningTitle}>Significado Direito</h2>
          <p>{card.significados.direito}</p>
        </div>
        <div className={styles.meaning}>
          <h2 className={styles.meaningTitle}>Significado Invertido</h2>
          <p>{card.significados.invertido}</p>
        </div>
      </div>

      <Link to="/biblioteca" className={styles.backLink}>← Voltar para a Biblioteca</Link>
    </div>
  );
}

export default LearningCardDetailPage;