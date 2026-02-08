import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings';
import { baralhoDetalhado } from '../../../tarotDeck';
import { POSICOES_CRUZ_CELTA, POSICOES_TRES_CARTAS, POSICOES_TEMPLO_AFRODITE, POSICOES_ESCOLHA_CAMINHO } from '../../../constants/tarotConstants';
import Loader from '../../../components/common/Loader/Loader';
import styles from './CardDetailPage.module.css';

const positionMap = {
  celticCross: POSICOES_CRUZ_CELTA,
  threeCards: POSICOES_TRES_CARTAS,
  templeOfAphrodite: POSICOES_TEMPLO_AFRODITE,
  pathChoice: POSICOES_ESCOLHA_CAMINHO,
};

function CardDetailPage() {
  const { readingId, position } = useParams();
  const { data: readingData, isLoading: isLoadingReading, isError, error } = useSingleReading(readingId);
  
  const { cardDataFromReading, cardDetailsFromLibrary, positionName, backLinkUrl, interpretation } = useMemo(() => {
    if (!readingData || !readingData.cards_data) return {};
    
    const positionIndex = parseInt(position, 10) - 1;
    if (isNaN(positionIndex) || positionIndex < 0) return {};

    const cardFromReading = readingData.cards_data[positionIndex];
    if (!cardFromReading) return {};

    const cardFromLibrary = baralhoDetalhado.find(c => c.id === cardFromReading.id);
    
    const positionArray = positionMap[readingData.spread_type] || [];
    const realPositionIndex = readingData.spread_type === 'pathChoice' ? positionIndex % 4 : positionIndex;
    const posName = positionArray[realPositionIndex];

    // Pega a interpretação específica da carta para esta leitura
    const specificInterpretation = readingData.interpretation_data?.data?.interpretacao?.analise_cartas?.[positionIndex]?.texto || 
                                   readingData.interpretation_data?.data?.caminho1?.analises?.[positionIndex]?.texto ||
                                   readingData.interpretation_data?.data?.caminho2?.analises?.[positionIndex-4]?.texto;
    
    return { 
      cardDataFromReading: cardFromReading,
      cardDetailsFromLibrary: cardFromLibrary,
      positionName: posName,
      backLinkUrl: `/leitura/${readingId}`,
      interpretation: specificInterpretation
    };
  }, [readingData, position, readingId]);

  if (isLoadingReading) return <Loader />;
  if (isError) return <div className="content_wrapper"><p>Erro ao carregar leitura: {error.message}</p></div>;
  if (!cardDataFromReading || !cardDetailsFromLibrary) {
    return (
      <div className={`content_wrapper ${styles.notFound}`}>
        <h1>Carta não encontrada</h1>
        <p>Não foi possível carregar os dados da carta. Por favor, volte.</p>
        <Link to="/painel" className={styles.backLink}>Voltar ao Painel</Link>
      </div>
    );
  }

  return (
    <div className={`content_wrapper ${styles.pageContainer}`}>
      <Link to={backLinkUrl} className={styles.backLink}>← Voltar para a tiragem completa</Link>
      
      <div className={styles.layoutGrid}>
        {/* Coluna da Esquerda: Imagem */}
        <div className={styles.leftColumn}>
          <img 
            src={cardDetailsFromLibrary.img} 
            alt={cardDetailsFromLibrary.nome} 
            className={`${styles.cardImage} ${cardDataFromReading.invertida ? styles.inverted : ''}`} 
          />
        </div>

        {/* Coluna da Direita: Informações */}
        <div className={styles.rightColumn}>
          {positionName && <h3 className={styles.positionName}>{positionName}</h3>}
          <h1 className={styles.cardName}>{cardDetailsFromLibrary.nome} {cardDataFromReading.invertida ? '(Invertida)' : ''}</h1>
          <p className={styles.cardType}>{cardDetailsFromLibrary.tipo}{cardDetailsFromLibrary.naipe ? ` - ${cardDetailsFromLibrary.naipe}` : ''}</p>
          
          {interpretation && (
            <div className={styles.interpretationBox}>
              <h4>Análise para sua Pergunta</h4>
              <p>{interpretation}</p>
            </div>
          )}

          <div className={styles.keywordsGrid}>
            <div className={styles.keywordSection}>
              <h3 className={styles.keywordTitle}>Direito</h3>
              <ul>
                {cardDetailsFromLibrary.palavras_chave.direito.map((keyword, index) => <li key={index}>{keyword}</li>)}
              </ul>
            </div>
            <div className={styles.keywordSection}>
              <h3 className={styles.keywordTitle}>Invertido</h3>
              <ul>
                {cardDetailsFromLibrary.palavras_chave.invertido.map((keyword, index) => <li key={index}>{keyword}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.meaningsSection}>
        <div className={styles.meaning}>
          <h2 className={styles.meaningTitle}>Significado Geral (Direito)</h2>
          <p>{cardDetailsFromLibrary.significados.direito}</p>
        </div>
        <div className={styles.meaning}>
          <h2 className={styles.meaningTitle}>Significado Geral (Invertido)</h2>
          <p>{cardDetailsFromLibrary.significados.invertido}</p>
        </div>
      </div>
    </div>
  );
}

export default CardDetailPage;
