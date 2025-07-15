// src/pages/reading/CardDetailPage/CardDetailPage.jsx - VERSÃO REATORADA COM TANSTACK QUERY

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings'; // 1. Hook para dados principais
import { getDidacticMeaning } from '../../../services/aiService'; // Chamada de API secundária
import { POSICOES_CRUZ_CELTA } from '../../../constants/tarotConstants';
import styles from './CardDetailPage.module.css';
import Chat from '../../../components/Chat/Chat';
import Loader from '../../../components/common/Loader/Loader';

function CardDetailPage() {
  const { readingId, position } = useParams();
  
  // 2. Busca os dados da leitura completa usando o hook. O cache da TanStack Query fará com que
  // esta chamada seja instantânea se você acabou de vir da PastReadingPage.
  const { data: readingData, isLoading: isLoadingReading, isError, error } = useSingleReading(readingId);

  // 3. Estado local APENAS para a lógica desta página (o texto didático).
  const [didacticText, setDidacticText] = useState('');
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(true);

  // 4. Efeito para buscar o significado didático. Ele depende dos dados do hook.
  useEffect(() => {
    if (readingData) {
      const positionIndex = parseInt(position, 10) - 1;
      const card = readingData.cards_data?.[positionIndex];
      const positionName = POSICOES_CRUZ_CELTA[positionIndex];

      if (card && positionName) {
        setIsLoadingMeaning(true);
        getDidacticMeaning(card.nome, card.invertida ? 'Invertida' : 'Normal', positionName)
          .then(data => setDidacticText(data.didacticText))
          .catch(err => setDidacticText('Não foi possível carregar o significado arquetípico.'))
          .finally(() => setIsLoadingMeaning(false));
      }
    }
  }, [readingData, position]); // Depende dos dados da leitura e da posição da carta

  // 5. Renderização baseada nos estados dos hooks e do estado local.
  if (isLoadingReading) return <Loader />;
  if (isError) return <div className="content_wrapper"><p>Erro: {error.message}</p></div>;
  if (!readingData) return <div className="content_wrapper"><p>Não foi possível carregar os dados.</p></div>;

  const positionIndex = parseInt(position, 10) - 1;
  const card = readingData.cards_data[positionIndex];
  const interpretation = readingData.card_interpretations[positionIndex];
  const positionName = POSICOES_CRUZ_CELTA[positionIndex];
  const backLinkUrl = `/leitura/${readingId}`;
  const chatContext = `A pergunta foi "${readingData.question}". A carta é "${card.nome} ${card.invertida ? '(Invertida)' : ''}" na posição "${positionName}". A interpretação foi: "${interpretation || 'Nenhuma.'}"`;

  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        <Link to={backLinkUrl} className={styles.backLink}>← Voltar para a tiragem completa</Link>
        <div className={styles.cardDisplay}>
          <img src={card.img} alt={card.nome} className={`${styles.cardImage} ${card.invertida ? styles.inverted : ''}`} />
          <div className={styles.cardInfo}>
            <h3 className={styles.positionName}>{positionName}</h3>
            <h1 className={styles.cardName}>{card.nome} {card.invertida ? '(Invertida)' : ''}</h1>
          </div>
        </div>
        <div className={styles.didacticBox}>
          <h4>O Significado Arquetípico</h4>
          {isLoadingMeaning ? <p className={styles.loadingText}>Buscando nos anais...</p> : <p>{didacticText}</p>}
        </div>
        <div className={styles.interpretationBox}>
          <h4>Análise para sua Pergunta</h4>
          <p className={styles.context}><em>"{readingData.question}"</em></p>
          <p className={styles.interpretationText}>{interpretation}</p>
        </div>
        <Chat chatContext={chatContext} readingId={readingData.id} cardName={`${card.nome} ${card.invertida ? '(Invertida)' : ''}`} />
      </div>
    </div>
  );
}

export default CardDetailPage;