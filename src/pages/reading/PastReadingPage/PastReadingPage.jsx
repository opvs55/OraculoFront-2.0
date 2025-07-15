// src/pages/reading/PastReadingPage/PastReadingPage.jsx - VERSÃO REATORADA COM TANSTACK QUERY

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings'; // 1. Importa o novo hook
import styles from './PastReadingPage.module.css';
import Loader from '../../../components/common/Loader/Loader';
import CelticCrossLayout from '../../../components/CelticCrossLayout/CelticCrossLayout';
import ReadingDisplay from '../../../components/ReadingDisplay/ReadingDisplay';

function PastReadingPage() {
  const { readingId } = useParams();
  
  // 2. USA O HOOK: Ele gerencia o loading, erro e os dados para nós.
  const { data: currentReading, isLoading, isError, error } = useSingleReading(readingId);

  // 3. A renderização fica muito mais declarativa e limpa.
  if (isLoading) return <Loader customText="Carregando sua jornada..." />;
  
  if (isError) return <main className="content_wrapper"><p>Erro: {error.message}</p></main>;
  
  if (!currentReading) return <main className="content_wrapper"><p>Leitura não encontrada.</p></main>;

  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        <Link to="/painel" style={{marginBottom: '2rem', alignSelf: 'flex-start'}}>← Voltar para o Painel</Link>
        <h2 className={styles.question}>Revisitando sua pergunta: "{currentReading.question}"</h2>
        <div className={styles.resultsContainer}>
          <div className={styles.cardsSection}>
            <CelticCrossLayout 
              cards={currentReading.cards_data} 
              basePath={`/leitura/${currentReading.id}`} 
            />
          </div>
          <div className={styles.readingSection}>
            <ReadingDisplay text={currentReading.main_interpretation} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastReadingPage;