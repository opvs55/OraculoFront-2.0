import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Certifique-se que o hook useUserProfile está sendo importado corretamente
import { useUserProfile } from '../../hooks/useUserProfile'; 
import { useReadingsHistory } from '../../hooks/useReadings';
import { useCardOfTheWeek } from '../../hooks/useCardOfTheWeek'; 
import styles from './MeuGrimorioPage.module.css'; 
import Loader from '../../components/common/Loader/Loader'; 
import ProfileSummary from './ProfileSummary/ProfileSummary'; 
import ReadingHistory from './ReadingHistory/ReadingHistory'; 
import CardOfTheWeek from './CardOfTheWeek/CardOfTheWeek';   

function MeuGrimorioPage() { 
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user, loading: authLoading } = useAuth();
  
  // O hook useUserProfile já busca todos os dados do perfil, incluindo life_path_number
  const { profile, isLoading: profileLoading } = useUserProfile(user?.id); 
  const { data: readings, isLoading: historyLoading, isError } = useReadingsHistory(user?.id);
  const { cardData, revealAllowed, revealCard, isRevealing, isLoading: isLoadingCard } = useCardOfTheWeek(user?.id);

  const handleVideoEnd = () => setVideoAtualIndex(prev => (prev + 1) % 2);

  // Considera o carregamento do perfil E da carta da semana
  const isLoading = authLoading || profileLoading || isLoadingCard; 

  if (isLoading) return <Loader customText="Desvendando os mistérios do seu Grimório..." />; // Texto de loading mais temático

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
                // <<< PASSA O NÚMERO COMO PROP >>>
                lifePathNumber={profile?.life_path_number} 
  	          />
  	        </div>
  	        
  	        <div className={styles.cardOfTheWeekCard}>
  	          <CardOfTheWeek 
  	            cardData={cardData} 
                onReveal={revealCard} 
                revealAllowed={revealAllowed} 
                isRevealing={isRevealing} // Passa estado de revelação
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