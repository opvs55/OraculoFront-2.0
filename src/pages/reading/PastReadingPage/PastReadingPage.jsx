import React from 'react';
import { useParams } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings';
import styles from './PastReadingPage.module.css';
import Loader from '../../../components/common/Loader/Loader';
import ReadingDisplay from '../../../components/ReadingDisplay/ReadingDisplay';
import { useAuth } from '../../../context/AuthContext';
import GuestPrompt from '../../../components/GuestPrompt/GuestPrompt';

import CelticCrossLayout from '../../../components/CelticCrossLayout/CelticCrossLayout';
import ThreeCardLayout from '../../../components/ThreeCardLayout/ThreeCardLayout';
import TempleOfAphroditeLayout from '../../../components/TempleOfAphroditeLayout/TempleOfAphroditeLayout';
// NOVO: Importamos o nosso novo layout
import PathChoiceLayout from '../../../components/PathChoiceLayout/PathChoiceLayout';

function PastReadingPage() {
  const { readingId } = useParams();
  const { user } = useAuth();
  const { data: currentReading, isLoading, isError, error } = useSingleReading(readingId);

  if (isLoading) return <Loader customText="Carregando sua jornada..." />;
  if (isError) return <main className="content_wrapper"><p>Erro: {error.message}</p></main>;
  if (!currentReading) return <main className="content_wrapper"><p>Leitura não encontrada.</p></main>;

  const renderCardLayout = () => {
    const basePath = `/leitura/${currentReading.id}`;
    const cards = currentReading.cards_data;

    switch (currentReading.spread_type) {
      case 'threeCards':
        return <ThreeCardLayout cards={cards} basePath={basePath} />;
      case 'templeOfAphrodite':
        return <TempleOfAphroditeLayout cards={cards} basePath={basePath} />;
      // NOVO: Adicionamos o caso para renderizar a Escolha de Caminho
      case 'pathChoice':
        return <PathChoiceLayout cards={cards} basePath={basePath} />;
      case 'celticCross':
      default:
        return <CelticCrossLayout cards={cards} basePath={basePath} />;
    }
  };

  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        {!user && <GuestPrompt />}
        <h2 className={styles.question}>Revisitando sua pergunta: "{currentReading.question.path1 ? `Escolha entre '${currentReading.question.path1}' e '${currentReading.question.path2}'` : currentReading.question}"</h2>
        <div className={styles.resultsContainer}>
          <div className={styles.cardsSection}>
            {renderCardLayout()}
          </div>
          <div className={styles.readingSection}>
            <ReadingDisplay readingData={currentReading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastReadingPage;