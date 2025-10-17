import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings'; // ../../hooks - OK
import styles from './PastReadingPage.module.css'; // ./ - OK
import Loader from '../../../components/common/Loader/Loader'; // ../../components - OK
import ReadingDisplay from '../../../components/ReadingDisplay/ReadingDisplay'; // ../../components - OK
import { useAuth } from '../../../context/AuthContext'; // ../../context - OK
import GuestPrompt from '../../../components/GuestPrompt/GuestPrompt'; // ../../components - OK
import Chat from '../../../components/Chat/Chat'; // ../../components - OK

// Layouts das cartas
import CelticCrossLayout from '../../../components/CelticCrossLayout/CelticCrossLayout'; // ../../components - OK
import ThreeCardLayout from '../../../components/ThreeCardLayout/ThreeCardLayout'; // ../../components - OK
import TempleOfAphroditeLayout from '../../../components/TempleOfAphroditeLayout/TempleOfAphroditeLayout'; // ../../components - OK
import PathChoiceLayout from '../../../components/PathChoiceLayout/PathChoiceLayout'; // ../../components - OK
import DecorativeDivider from '../../../components/common/DecorativeDivider/DecorativeDivider'; 

function PastReadingPage() {
  const { readingId } = useParams();
  const { user } = useAuth();
  const { data: currentReading, isLoading, isError, error } = useSingleReading(readingId);

  const chatContext = useMemo(() => {
    if (!currentReading) return "Contexto da leitura indisponível.";
    const questionText = typeof currentReading.question === 'string' 
      ? currentReading.question 
      : `Escolha entre '${currentReading.question.path1}' e '${currentReading.question.path2}'`;
    let mainInterpretationText = "Interpretação principal não disponível.";
    if (currentReading.interpretation_data?.interpretationType === 'structured') {
        mainInterpretationText = currentReading.interpretation_data.data?.interpretacao?.resumo || 
                                 currentReading.interpretation_data.data?.resumo_geral ||
                                 currentReading.interpretation_data.data?.comparativo_final || 
                                 "Resumo estruturado não encontrado.";
    } else if (currentReading.main_interpretation) {
        mainInterpretationText = currentReading.main_interpretation;
    }
    const cardsText = currentReading.cards_data
      ? currentReading.cards_data.map((card, i) => `${i + 1}. ${card.nome} ${card.invertida ? '(Inv)' : ''}`).join(', ')
      : "Cartas não disponíveis.";
    return `A pergunta foi: "${questionText}". As cartas sorteadas foram: ${cardsText}. A interpretação principal/resumo foi: "${mainInterpretationText}"`;
  }, [currentReading]);


  if (isLoading) return <Loader customText="Carregando sua jornada..." />;
  if (isError) return <main className="content_wrapper"><p>Erro ao carregar leitura: {error.message}</p></main>;
  if (!currentReading) return <main className="content_wrapper"><p>Leitura não encontrada.</p></main>;

  const renderCardLayout = () => {
    const basePath = `/leitura/${currentReading.id}`;
    const cards = currentReading.cards_data;

    switch (currentReading.spread_type) {
      case 'threeCards':
        return <ThreeCardLayout cards={cards} basePath={basePath} />;
      case 'templeOfAphrodite':
        return <TempleOfAphroditeLayout cards={cards} basePath={basePath} />;
      case 'pathChoice':
        return <PathChoiceLayout cards={cards} basePath={basePath} />;
      case 'celticCross':
      default:
        if (cards && cards.length >= 10) {
            return <CelticCrossLayout cards={cards} basePath={basePath} />;
        } else if (cards && cards.length >= 3) {
            console.warn("Dados da Cruz Celta incompletos, renderizando como 3 Cartas.");
            return <ThreeCardLayout cards={cards.slice(0,3)} basePath={basePath} />;
        }
        return <p>Layout de cartas indisponível.</p>; 
    }
  };

  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        {!user && <GuestPrompt />}

        <h2 className={styles.question}>
          Revisitando sua pergunta: "{typeof currentReading.question === 'string' ? currentReading.question : `Escolha entre '${currentReading.question.path1}' e '${currentReading.question.path2}'`}"
        </h2>
        
        <div className={styles.resultsContainer}>
          <div className={styles.cardsSection}>
            {renderCardLayout()}
          </div>
          <div className={styles.readingSection}>
            <ReadingDisplay readingData={currentReading} />
          </div>
        </div>

        <div className={styles.chatSection}>
          <DecorativeDivider /> 
          <Chat chatContext={chatContext} readingId={readingId} />
        </div>

      </div>
    </div>
  );
}

export default PastReadingPage;