import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// Hooks e Serviços
import { useSingleReading, useUpdateDidacticCache } from '../../../hooks/useReadings';
import { getDidacticMeaning } from '../../../services/aiService';
import { normalizeTextForPath } from '../../../utils/stringUtils'; // Supondo que você tenha este utilitário
import { POSICOES_CRUZ_CELTA } from '../../../constants/tarotConstants';

// Componentes
import Chat from '../../../components/Chat/Chat';
import Loader from '../../../components/common/Loader/Loader';

// Estilos
import styles from './CardDetailPage.module.css';

function CardDetailPage() {
  const { readingId, position } = useParams();
  
  // Estados locais do componente
  const [didacticText, setDidacticText] = useState('');
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  // Hook para buscar os dados da leitura
  const { data: readingData, isLoading: isLoadingReading, isError, error } = useSingleReading(readingId);
  
  // Hook de mutação para atualizar o cache no banco de dados
  const { mutate: updateCache } = useUpdateDidacticCache();

  // Efeito para buscar o significado didático (com a nova lógica de cache)
  useEffect(() => {
    const fetchOrGetDidacticMeaning = async () => {
      if (!readingData || !readingData.cards_data) return;

      const positionIndex = parseInt(position, 10) - 1;
      if (positionIndex < 0 || positionIndex >= readingData.cards_data.length) return;

      const cachedInterpretations = readingData.didactic_interpretations;

      // 1. Verifica se a explicação já existe no cache
      if (cachedInterpretations && cachedInterpretations[positionIndex]) {
        setDidacticText(cachedInterpretations[positionIndex]);
        setIsLoadingMeaning(false);
        return;
      }

      // 2. Se não, busca na IA
      setIsLoadingMeaning(true);
      try {
        const card = readingData.cards_data[positionIndex];
        const positionName = POSICOES_CRUZ_CELTA[positionIndex];
        const dataFromAI = await getDidacticMeaning(card.nome, card.invertida ? 'Invertida' : 'Normal', positionName);
        const newDidacticText = dataFromAI.didacticText;

        setDidacticText(newDidacticText);

        // 3. Salva no banco usando a mutação do React Query
        const updatedInterpretations = [...(readingData.didactic_interpretations || Array(10).fill(null))];
        updatedInterpretations[positionIndex] = newDidacticText;

        updateCache({ readingId, updatedInterpretations });

      } catch (err) {
        console.error("Erro ao buscar ou salvar significado didático:", err);
        setDidacticText('Não foi possível carregar o significado arquetípico.');
      } finally {
        setIsLoadingMeaning(false);
      }
    };
    
    fetchOrGetDidacticMeaning();
  }, [readingData, position, readingId, updateCache]);

  // Reseta o erro de vídeo ao mudar de carta
  useEffect(() => {
    setVideoError(false);
  }, [position]);
  
  // Otimiza o cálculo de variáveis derivadas dos dados da leitura
  const { card, interpretation, positionName, backLinkUrl, chatContext, videoPath } = useMemo(() => {
    if (!readingData || !readingData.cards_data) return {};
    
    const positionIndex = parseInt(position, 10) - 1;
    if (isNaN(positionIndex)) return {};

    const currentCard = readingData.cards_data[positionIndex];
    if (!currentCard) return {};
    
    const currentInterpretation = readingData.card_interpretations[positionIndex];
    const currentPositionName = POSICOES_CRUZ_CELTA[positionIndex];
    const backUrl = `/leitura/${readingId}`;
    const context = `A pergunta foi "${readingData.question}". A carta é "${currentCard.nome} ${currentCard.invertida ? '(Invertida)' : ''}" na posição "${currentPositionName}". A interpretação inicial foi: "${currentInterpretation || 'Nenhuma.'}"`;
    const normalizedCardName = normalizeTextForPath(currentCard.nome);
    const path = `/assets/videos/${normalizedCardName}.mp4`;

    return { 
      card: currentCard, 
      interpretation: currentInterpretation, 
      positionName: currentPositionName,
      backLinkUrl: backUrl,
      chatContext: context,
      videoPath: path
    };
  }, [readingData, position, readingId]);


  // --- Renderização Condicional ---
  if (isLoadingReading) return <Loader />;
  if (isError) return <div className="content_wrapper"><p>Erro ao carregar leitura: {error.message}</p></div>;
  if (!card) return <div className="content_wrapper"><p>Não foi possível carregar os dados da carta. Por favor, volte ao painel.</p></div>;

  // --- Renderização do Componente ---
  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        <Link to={backLinkUrl} className={styles.backLink}>← Voltar para a tiragem completa</Link>
        
        <div className={styles.cardDisplay}>
          {!videoError ? (
            <video
              key={videoPath}
              src={videoPath}
              className={`${styles.cardImage} ${card.invertida ? styles.inverted : ''}`}
              autoPlay muted loop playsInline
              onError={() => setVideoError(true)}
            />
          ) : (
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
          {isLoadingMeaning ? <p className={styles.loadingText}>Buscando nos anais do Tarot...</p> : <p>{didacticText}</p>}
        </div>

        <div className={styles.interpretationBox}>
          <h4>Análise para sua Pergunta</h4>
          <p className={styles.context}><em>"{readingData.question}"</em></p>
          <p className={styles.interpretationText}>{interpretation}</p>
        </div>
        
        <Chat 
          chatContext={chatContext} 
          readingId={readingData.id}
          cardName={`${card.nome} ${card.invertida ? '(Invertida)' : ''}`}
        />
      </div>
    </div>
  );
}

export default CardDetailPage;