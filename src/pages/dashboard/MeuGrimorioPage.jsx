import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile'; 
import { useRecentReadings } from '../../hooks/useRecentReadings';
import { formatRelativeDate } from '../../utils/formatRelativeDate';
import { getCardOfTheWeekLabel } from '../../utils/getCardOfTheWeekLabel';
import LoggedHeroCard from './LoggedHome/LoggedHeroCard';
import ContinueReadingSection from './LoggedHome/ContinueReadingSection';
import QuickActionsGrid from './LoggedHome/QuickActionsGrid';
import styles from './MeuGrimorioPage.module.css'; 

function MeuGrimorioPage() { 
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const { data: recentReadings = [], isLoading, isError, refetch } = useRecentReadings(user?.id, 3);

  const handleVideoEnd = () => setVideoAtualIndex(prev => (prev + 1) % 2);

  const displayName = useMemo(() => {
    const fullName = profile?.full_name?.trim();
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return profile?.username || 'Buscador';
  }, [profile]);

  const lastReadingLabel = useMemo(() => {
    if (!recentReadings.length) return 'Sem leituras ainda';
    return formatRelativeDate(recentReadings[0].created_at);
  }, [recentReadings]);

  const cardOfTheWeek = useMemo(
    () => getCardOfTheWeekLabel(profile?.card_of_the_week || profile?.card_of_the_week_name),
    [profile?.card_of_the_week, profile?.card_of_the_week_name],
  );

  const publicReadingsCount = profile?.public_readings_count;

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
        <div className={styles.dashboardContent}>
          <LoggedHeroCard
            displayName={displayName}
            lastReadingLabel={lastReadingLabel}
            cardOfTheWeek={cardOfTheWeek}
            publicReadingsCount={publicReadingsCount}
          />

          <ContinueReadingSection
            readings={recentReadings}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />

          <QuickActionsGrid />
        </div>
      </div>
    </div>
  );
}

export default MeuGrimorioPage;
