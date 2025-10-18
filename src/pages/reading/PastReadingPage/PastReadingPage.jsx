// src/pages/reading/PastReadingPage/PastReadingPage.jsx (VERSÃO ATUALIZADA)

import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSingleReading } from '../../../hooks/useReadings';
import styles from './PastReadingPage.module.css';
import Loader from '../../../components/common/Loader/Loader';
import ReadingDisplay from '../../../components/ReadingDisplay/ReadingDisplay';
import { useAuth } from '../../../context/AuthContext';
import GuestPrompt from '../../../components/GuestPrompt/GuestPrompt';
import Chat from '../../../components/Chat/Chat';
import DecorativeDivider from '../../../components/common/DecorativeDivider/DecorativeDivider';
import ReadingInteractionBar from '../../../components/ReadingInteractionBar/ReadingInteractionBar';
import CommentsSection from '../../../components/CommentsSection/CommentsSection';

// Layouts das cartas
import CelticCrossLayout from '../../../components/CelticCrossLayout/CelticCrossLayout';
import ThreeCardLayout from '../../../components/ThreeCardLayout/ThreeCardLayout';
import TempleOfAphroditeLayout from '../../../components/TempleOfAphroditeLayout/TempleOfAphroditeLayout';
import PathChoiceLayout from '../../../components/PathChoiceLayout/PathChoiceLayout';
import AuthorPost from '../../../components/AuthorPost/AuthorPost';


function PastReadingPage() {
  const { readingId } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  const temporaryReadingData = location.state?.readingData;
  const { data: readingFromHook, isLoading: isLoadingHook, isError: isHookError, error: hookError } = useSingleReading(
    !temporaryReadingData && !readingId?.startsWith('temp-') ? readingId : null
  );
  const isLoading = !temporaryReadingData && isLoadingHook;
  const isError = isHookError;
  const error = hookError;
  const currentReading = temporaryReadingData || readingFromHook;

  const chatContext = useMemo(() => {
    if (!currentReading) return "Contexto da leitura indisponível.";

    const questionText = typeof currentReading.question === 'string'
      ? currentReading.question
      : `Escolha entre '${currentReading.question?.path1 || 'Caminho 1'}' e '${currentReading.question?.path2 || 'Caminho 2'}'`;

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


  // --- RENDERIZAÇÃO ---

  if (isLoading) return <Loader customText="Carregando sua jornada..." />;

  if (isError) return <main className="content_wrapper"><p>Erro ao carregar leitura: {error?.message || 'Erro desconhecido'}</p></main>;

  if (!currentReading) {
    if (readingId?.startsWith('temp-') && !temporaryReadingData) {
      return (
        <main className="content_wrapper" style={{textAlign: 'center', padding: '2rem'}}>
          <h1>Leitura Expirada</h1>
          <p>Esta leitura era temporária e não pode ser recarregada.</p>
          <p>Para salvar suas leituras, <Link to="/cadastro">crie uma conta</Link> ou <Link to="/login">faça login</Link>.</p>
          <Link to="/tarot" className={styles.backLink}>Fazer Nova Leitura Teste</Link>
        </main>
      );
    }
    return <main className="content_wrapper"><p>Leitura não encontrada.</p></main>;
  }

  const renderCardLayout = () => {
    const basePath = `/leitura/${currentReading.id}`;
    const cards = currentReading.cards_data;

    if (!Array.isArray(cards)) {
        console.error("Dados das cartas inválidos:", cards);
        return <p>Erro ao carregar o layout das cartas.</p>;
    }

    switch (currentReading.spread_type) {
      case 'threeCards':
        return cards.length >= 3 ? <ThreeCardLayout cards={cards} basePath={basePath} /> : <p>Layout indisponível (dados incompletos).</p>;
      case 'templeOfAphrodite':
        return cards.length >= 7 ? <TempleOfAphroditeLayout cards={cards} basePath={basePath} /> : <p>Layout indisponível (dados incompletos).</p>;
      case 'pathChoice':
        return cards.length >= 8 ? <PathChoiceLayout cards={cards} basePath={basePath} /> : <p>Layout indisponível (dados incompletos).</p>;
      case 'celticCross':
      default:
        if (cards.length >= 10) {
            return <CelticCrossLayout cards={cards} basePath={basePath} />;
        } else {
             console.warn("Dados da Cruz Celta incompletos para a leitura:", readingId);
             return cards.length >= 3 ? <ThreeCardLayout cards={cards.slice(0,3)} basePath={basePath} /> : <p>Layout indisponível (dados incompletos).</p>;
        }
    }
  };

  const isOwner = user && currentReading.user_id === user.id;
  const isTemporary = currentReading.id.startsWith('temp-');
  const authorUsername = currentReading.profiles?.username || (isOwner ? user.profile?.username : 'desconhecido');


  return (
    <div className="content_wrapper">
      <div className={styles.container}>
        {isTemporary && <GuestPrompt />}

        {/* --- 1. SEÇÃO DE CONTEÚDO (Comum a todos) --- */}
        <h2 className={styles.question}>
          Revisitando sua pergunta: "{typeof currentReading.question === 'string' ? currentReading.question : `Escolha entre '${currentReading.question?.path1 || 'Caminho 1'}' e '${currentReading.question?.path2 || 'Caminho 2'}'`}"
        </h2>

        <div className={styles.resultsContainer}>
          <div className={styles.cardsSection}>
            {renderCardLayout()}
          </div>
          <div className={styles.readingSection}>
            <ReadingDisplay readingData={currentReading} />
          </div>
        </div>

        {/* --- 2. SEÇÃO DE COMUNIDADE (Pública) --- */}
        {!isTemporary && (
          <div className={styles.communitySection}>
            <ReadingInteractionBar 
              reading={currentReading} 
              user={user} 
              isOwner={isOwner} 
            />
            
            {/* VVVV ------ AQUI ESTÁ A MUDANÇA ------ VVVV */}
            {currentReading.is_public && (
              <div className={styles.publicContentGrid}> {/* 1. Adicionado este container */}
                
                {/* 2. Coluna da Esquerda: Reflexão */}
                <div className={styles.reflectionColumn}>
                  <AuthorPost 
                    text={currentReading.shared_title} 
                    username={authorUsername}
                  />
                </div>
                
                {/* 3. Coluna da Direita: Comentários */}
                <div className={styles.commentsColumn}>
                  <CommentsSection readingId={currentReading.id} />
                </div>

              </div>
            )}
            {/* ^^^^ ------ FIM DA MUDANÇA ------ ^^^^ */}

          </div>
        )}
        
        {/* --- 3. SEÇÃO PRIVADA (Só o Dono) --- */}
        {!isTemporary && isOwner && (
          <div className={styles.privateSection}>
            <DecorativeDivider />
            <h3 className={styles.privateTitle}>Aprofunde sua Leitura (Privado)</h3>
            <p className={styles.privateNotice}>Somente você pode ver este chat com a I.A.</p>
            <Chat chatContext={chatContext} readingId={currentReading.id} />
          </div>
        )}

      </div> {/* Fim .container */}
    </div> // Fim .content_wrapper
  );
}

export default PastReadingPage;