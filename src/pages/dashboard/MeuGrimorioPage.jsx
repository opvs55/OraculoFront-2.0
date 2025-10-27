import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Certifique-se que o hook useUserProfile está sendo importado corretamente
import { useUserProfile } from '../../hooks/useUserProfile'; 
import { useReadingsHistory } from '../../hooks/useReadings';
import { useCardOfTheWeek } from '../../hooks/useCardOfTheWeek'; 
import styles from './MeuGrimorioPage.module.css'; 
// Loader não é mais usado aqui, mas pode ser mantido se outros componentes o usarem
// import Loader from '../../components/common/Loader/Loader'; 
import ProfileSummary from './ProfileSummary/ProfileSummary'; 
import ReadingHistory from './ReadingHistory/ReadingHistory'; 
import CardOfTheWeek from './CardOfTheWeek/CardOfTheWeek';   

function MeuGrimorioPage() { 
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user } = useAuth(); // authLoading removido pois já é tratado pelo ProtectedRoute
  
  // O hook useUserProfile já busca todos os dados do perfil, incluindo life_path_number
  const { profile, isLoading: profileLoading } = useUserProfile(user?.id); 
  const { data: readings, isLoading: historyLoading, isError } = useReadingsHistory(user?.id);
  // O isLoadingCard é usado internamente pelo hook, não precisamos dele aqui
  const { cardData, revealAllowed, revealCard, isRevealing } = useCardOfTheWeek(user?.id);

  const handleVideoEnd = () => setVideoAtualIndex(prev => (prev + 1) % 2);

  // --- MUDANÇA PRINCIPAL ---
  // O Loader de ecrã inteiro foi REMOVIDO.
  // A página agora renderiza imediatamente o layout (vídeo, grelha),
  // e os componentes filhos (ProfileSummary, ReadingHistory)
  // são responsáveis por mostrar os seus próprios loaders internos.
  // const isLoading = authLoading || profileLoading || isLoadingCard; 
  // if (isLoading) return <Loader ... />; 
  // --- FIM DA MUDANÇA ---

  return (
    <div className={styles.painelContainer}>
      <video
        key={videoAtualIndex} autoPlay muted playsInline onEnded={handleVideoEnd}
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
            <div className={styles.profileCard}> 
              <ProfileSummary 
                profile={profile} 
                readings={readings} // Passa o número de leituras
                isLoading={profileLoading} // Passa estado de carregamento específico do perfil
                lifePathNumber={profile?.life_path_number} 
              />
            </div>
            
            <div className={styles.cardOfTheWeekCard}>
              <CardOfTheWeek 
                cardData={cardData} 
                onReveal={revealCard} 
                revealAllowed={revealAllowed} 
                isRevealing={isRevealing} // Passa estado de revelação
                // prop 'isLoading' removida pois o componente não a utiliza
              />
            </div>

            <Link to="/tarot" className={styles.newReadingButtonLarge}>
              Fazer Nova Leitura
            </Link>
          </div>

          {/* Coluna da Direita */}
          <div className={styles.rightColumn}>
            <div className={styles.historyCard}>
              <ReadingHistory 
                readings={readings} 
                isLoading={historyLoading} // Passa estado de carregamento específico do histórico
                isError={isError} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuGrimorioPage;