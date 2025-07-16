// src/pages/reading/CardDetailPage/CardDetailPage.jsx
// VERSÃO SIMPLIFICADA "VÍDEO DIRETO"

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// Hooks e Serviços
import { useSingleReading } from '../../../hooks/useReadings';
import { getDidacticMeaning } from '../../../services/aiService';

// Utilitários e Constantes
import { normalizeTextForPath } from '../../../utils/stringUtils';
import { POSICOES_CRUZ_CELTA } from '../../../constants/tarotConstants';

// Componentes
import Chat from '../../../components/Chat/Chat';
import Loader from '../../../components/common/Loader/Loader';

// Estilos
import styles from './CardDetailPage.module.css';

function CardDetailPage() {
  const { readingId, position } = useParams();

  // --- ESTADOS DO COMPONENTE ---
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false); // Mantido para o fallback
  const [didacticText, setDidacticText] = useState('');
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(true);
  // REMOVIDO: O estado 'animationState' não é mais necessário.

  // --- BUSCA DE DADOS ---
  const { data: readingData, isLoading: isLoadingReading, isError, error } = useSingleReading(readingId);

  // --- HOOKS ---
  const { videoPath, card, interpretation, positionName, backLinkUrl, chatContext } = useMemo(() => {
    if (!readingData) {
      return { videoPath: '', card: null, interpretation: '', positionName: '', backLinkUrl: '/', chatContext: '' };
    }
    const positionIndex = parseInt(position, 10) - 1;
    const currentCard = readingData.cards_data[positionIndex];
    const currentInterpretation = readingData.card_interpretations[positionIndex];
    const currentPositionName = POSICOES_CRUZ_CELTA[positionIndex];
    if (!currentCard) {
      return { videoPath: '', card: null, interpretation: '', positionName: '', backLinkUrl: '/', chatContext: '' };
    }
    const normalized = normalizeTextForPath(currentCard.nome);
    const path = `/assets/videos/${normalized}.mp4`;
    const backUrl = `/leitura/${readingId}`;
    const context = `A pergunta foi "${readingData.question}". A carta é "${currentCard.nome} ${currentCard.invertida ? '(Invertida)' : ''}" na posição "${currentPositionName}". A interpretação foi: "${currentInterpretation || 'Nenhuma.'}"`;
    return { 
      videoPath: path, 
      card: currentCard, 
      interpretation: currentInterpretation, 
      positionName: currentPositionName,
      backLinkUrl: backUrl,
      chatContext: context
    };
  }, [readingData, position, readingId]);

  // Efeito para buscar o significado didático
  useEffect(() => {
    if (card && positionName) {
      setIsLoadingMeaning(true);
      getDidacticMeaning(card.nome, card.invertida ? 'Invertida' : 'Normal', positionName)
        .then(data => setDidacticText(data.didacticText))
        .catch(err => setDidacticText('Não foi possível carregar o significado arquetípico.'))
        .finally(() => setIsLoadingMeaning(false));
    }
  }, [card, positionName]);
  
  // REMOVIDO: O useEffect que controlava o timer de 3 segundos foi removido.

  // Efeito para controlar a animação de entrada da página
  useEffect(() => {
    if (!isLoadingReading && readingData) {
      setIsContentLoaded(true);
    }
  }, [isLoadingReading, readingData]);
  
  // Efeito para resetar o erro do vídeo ao navegar entre as cartas
  useEffect(() => {
    setVideoError(false);
  }, [position]);

  // --- RENDERIZAÇÃO CONDICIONAL ---
  if (isLoadingReading) {
    return <Loader />;
  }
  if (isError) return <div className="content_wrapper"><p>Erro ao carregar leitura: {error.message}</p></div>;
  if (!readingData || !card) return <div className="content_wrapper"><p>Não foi possível carregar os dados da leitura ou da carta.</p></div>;

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="content_wrapper">
      <div className={`${styles.container} ${isContentLoaded ? styles.loaded : ''}`}>
        <Link to={backLinkUrl} className={styles.backLink}>← Voltar para a tiragem completa</Link>
        
        <div className={styles.cardDisplay}>
          {/* LÓGICA DE EXIBIÇÃO SIMPLIFICADA */}
          {!videoError ? (
            // O vídeo agora é o padrão.
            <video
              src={videoPath}
              className={`${styles.cardImage} ${card.invertida ? styles.inverted : ''}`}
              autoPlay
              muted
              playsInline
              onError={() => setVideoError(true)} // Se der erro, ativa o fallback.
            />
          ) : (
            // A imagem só aparece se o vídeo falhar.
            <img 
              src={card.img} 
              alt={card.nome} 
              className={`${styles.cardImage} ${card.invertida ? styles.inverted : ''}`} 
            />
          )}
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
        
        <div className={styles.chatContainer}>
          <Chat chatContext={chatContext} readingId={readingData.id} cardName={`${card.nome} ${card.invertida ? '(Invertida)' : ''}`} />
        </div>
      </div>
    </div>
  );
}

export default CardDetailPage;