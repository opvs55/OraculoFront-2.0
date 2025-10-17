import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useReadingsHistory } from '../../hooks/useReadings';
import { useCardOfTheWeek } from '../../hooks/useCardOfTheWeek'; 
import styles from './MeuGrimorioPage.module.css'; 
import Loader from '../../components/common/Loader/Loader';

// CAMINHOS CORRIGIDOS USANDO EXATAMENTE O QUE VOCÊ FORNECEU
import ProfileSummary from './ProfileSummary/ProfileSummary'; // Assumindo que estão na mesma pasta 'dashboard'
import ReadingHistory from './ReadingHistory/ReadingHistory'; // Assumindo que estão na mesma pasta 'dashboard'
import CardOfTheWeek from './CardOfTheWeek/CardOfTheWeek';   // Assumindo que estão na mesma pasta 'dashboard'

function MeuGrimorioPage() { 
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user, loading: authLoading } = useAuth();
  
  const { profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const { data: readings, isLoading: historyLoading, isError } = useReadingsHistory(user?.id);
  const { cardData, revealAllowed, revealCard, isRevealing, isLoading: isLoadingCard } = useCardOfTheWeek(user?.id);

  const handleVideoEnd = () => setVideoAtualIndex(prev => (prev + 1) % 2);

  const isLoading = authLoading || isLoadingCard; 

  if (isLoading) return <Loader />;

  return (
    <div className={styles.painelContainer}>
      <video
        key={videoAtualIndex}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className={styles.videoFundo}
      >
        <source src={`/assets/v${videoAtualIndex + 1}.mp4`} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className={styles.videoOverlay}></div>

      <div className={styles.conteudoSobreposto}>
        <div className={`content_wrapper ${styles.dashboardGrid}`}>
          {/* Coluna da Esquerda */}
          <div className={styles.leftColumn}>
            <ProfileSummary 
              profile={profile} 
              readings={readings} 
              isLoading={profileLoading} 
            />
            <CardOfTheWeek 
              cardData={cardData} 
              onReveal={revealCard} 
              revealAllowed={revealAllowed} 
            />
             <Link to="/" className={styles.newReadingButtonLarge}>
                Fazer Nova Leitura
             </Link>
          </div>

          {/* Coluna da Direita */}
          <div className={styles.rightColumn}>
            <ReadingHistory 
              readings={readings} 
              isLoading={historyLoading} 
              isError={isError} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuGrimorioPage;