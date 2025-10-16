import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useReadingsHistory } from '../../hooks/useReadings';
import styles from './PainelPage.module.css';
import Loader from '../../components/common/Loader/Loader';

// Importando nossos novos componentes de dashboard
import ProfileSummary from '../dashboard/ProfileSummary/ProfileSummary';
import ReadingHistory from '../dashboard/ReadingHistory/ReadingHistory';
// CardOfTheWeek será criado no próximo passo, por enquanto, vamos preparar o lugar.

function PainelPage() {
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const { data: readings, isLoading: historyLoading, isError } = useReadingsHistory(user?.id);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % 2);
  };

  if (authLoading) {
    return <Loader />;
  }

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
            {/* O espaço para a "Carta da Semana" está aqui. Por enquanto, um botão de Nova Leitura */}
            <div className={styles.newReadingCard}>
                <h2>Oráculo</h2>
                <p>Pronto para uma nova jornada de autoconhecimento? Todas as tiragens estão disponíveis.</p>
                <Link to="/" className={styles.newReadingButton}>Fazer Nova Leitura</Link>
            </div>
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

export default PainelPage;