// src/pages/reading/PastReadingPage/PastReadingPage.jsx - VERSÃO COMPLETA E ATUALIZADA

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings';
import styles from './PastReadingPage.module.css';
import Loader from '../../../components/common/Loader/Loader';
import CelticCrossLayout from '../../../components/CelticCrossLayout/CelticCrossLayout';
import ReadingDisplay from '../../../components/ReadingDisplay/ReadingDisplay';

function PastReadingPage() {
  const { readingId } = useParams();
  
  // O hook gerencia o loading, erro e os dados para nós.
  const { data: currentReading, isLoading, isError, error } = useSingleReading(readingId);

  // A renderização fica muito mais declarativa e limpa.
  if (isLoading) return <Loader customText="Carregando sua jornada..." />;
  
  if (isError) return <main className="content_wrapper"><p>Erro: {error.message}</p></main>;
  
  if (!currentReading) return <main className="content_wrapper"><p>Leitura não encontrada.</p></main>;

  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        <h2 className={styles.question}>Revisitando sua pergunta: "{currentReading.question}"</h2>
        <div className={styles.resultsContainer}>
          <div className={styles.cardsSection}>
            <CelticCrossLayout 
              cards={currentReading.cards_data} 
              basePath={`/leitura/${currentReading.id}`} 
            />
          </div>
          <div className={styles.readingSection}>
            {/* A alteração está aqui: adicionamos a prop 'readingId'.
              Isso permite que o componente ReadingDisplay salve o progresso da "conversa".
            */}
            <ReadingDisplay 
              text={currentReading.main_interpretation} 
              readingId={currentReading.id} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastReadingPage;