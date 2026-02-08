import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile'; 
import { useRecentReadings } from '../../hooks/useRecentReadings';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useGrimorioReadings } from '../../hooks/useGrimorioReadings';
import { useWeeklyCard } from '../../hooks/useWeeklyCard';
import { useGrimorioInsights, useDerivedGrimorioInsights } from '../../hooks/useGrimorioInsights';
import { formatRelativeDate } from '../../utils/formatRelativeDate';
import { getQuestionText } from '../../utils/getQuestionText';
import GrimorioToolbar from './Grimorio/GrimorioToolbar';
import WeeklyCardRitual from './Grimorio/WeeklyCardRitual';
import ReadingHistoryList from './Grimorio/ReadingHistoryList';
import InsightsPanel from './Grimorio/InsightsPanel';
import styles from './MeuGrimorioPage.module.css'; 

function MeuGrimorioPage() { 
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * 2));
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const { data: recentReadings = [], isLoading: isLoadingRecent, isError: isErrorRecent, refetch } = useRecentReadings(user?.id, 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [spreadType, setSpreadType] = useState('');
  const [period, setPeriod] = useState('30d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [privacy, setPrivacy] = useState('');
  const [withComments, setWithComments] = useState(false);
  const [withStars, setWithStars] = useState(false);
  const [cardFilter, setCardFilter] = useState('');

  const debouncedSearch = useDebouncedValue(searchTerm, 350);
  const {
    weekStart,
    cardDetails,
    revealAllowed,
    revealCard,
    isRevealing,
    isSessionLoading,
    errorMessage,
  } = useWeeklyCard(user?.id);
  const { data: insightsReadings, isLoading: isInsightsLoading } = useGrimorioInsights(user?.id);
  const derivedInsights = useDerivedGrimorioInsights(insightsReadings);

  const handleVideoEnd = () => setVideoAtualIndex(prev => (prev + 1) % 2);
  const spreadLabels = {
    celticCross: 'Cruz Celta',
    threeCards: '3 Cartas',
    templeOfAphrodite: 'Templo de Afrodite',
    pathChoice: 'Escolha de Caminho',
    oneCard: 'Uma Carta',
  };

  const displayName = useMemo(() => {
    const fullName = profile?.full_name?.trim();
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return profile?.username || 'Buscador';
  }, [profile]);

  const { periodStart, periodEnd } = useMemo(() => {
    if (period === 'all') {
      return { periodStart: null, periodEnd: null };
    }
    if (period === 'custom') {
      return {
        periodStart: customRange.start ? new Date(customRange.start).toISOString() : null,
        periodEnd: customRange.end ? new Date(`${customRange.end}T23:59:59`).toISOString() : null,
      };
    }
    const now = new Date();
    const start = new Date();
    if (period === '7d') start.setDate(now.getDate() - 7);
    if (period === '30d') start.setDate(now.getDate() - 30);
    if (period === '90d') start.setDate(now.getDate() - 90);
    return {
      periodStart: start.toISOString(),
      periodEnd: now.toISOString(),
    };
  }, [period, customRange]);

  const {
    readings,
    isLoading,
    isError,
    refetch: refetchHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    queryKey,
    totalCount,
  } = useGrimorioReadings({
    userId: user?.id,
    searchTerm: debouncedSearch,
    spreadType,
    periodStart,
    periodEnd,
    privacy,
    withComments,
    withStars,
    cardFilter,
  });

  const continueReading = recentReadings[0];
  const continueTitle =
    continueReading?.shared_title
    || getQuestionText(continueReading?.question, continueReading?.spread_type)
    || 'Leitura sem título';

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
        <div className={styles.grimorioLayout}>
          <div className={styles.mainColumn}>
            <WeeklyCardRitual
              cardDetails={cardDetails}
              revealAllowed={revealAllowed}
              onReveal={revealCard}
              isRevealing={isRevealing}
              isSessionLoading={isSessionLoading}
              errorMessage={errorMessage}
              onFilterByCard={(cardName) => {
                setCardFilter(cardName);
                setSearchTerm('');
              }}
              onRelateRecent={() => setPeriod('30d')}
            />

            <section className={styles.continueSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Continue de onde parou</h2>
                  <span className={styles.sectionNote}>
                    Última leitura · {continueReading ? formatRelativeDate(continueReading.created_at) : 'Sem leituras'}
                  </span>
              </div>
              {isLoadingRecent && <div className={styles.historySkeleton} />}
              {isErrorRecent && (
                <div className={styles.historyEmpty}>
                  <p>Não foi possível carregar sua última leitura.</p>
                  <button type="button" className={styles.historyActionPrimary} onClick={refetch}>
                    Tentar novamente
                  </button>
                </div>
              )}
              {!isLoadingRecent && !isErrorRecent && continueReading && (
                <div className={styles.continueCard}>
                  <div>
                    <p className={styles.continueLabel}>Para {displayName}</p>
                    <h3 className={styles.continueTitle}>{continueTitle}</h3>
                    <p className={styles.continueMeta}>
                      {formatRelativeDate(continueReading.created_at)} · {spreadLabels[continueReading.spread_type] || continueReading.spread_type}
                    </p>
                  </div>
                  <Link to={`/leitura/${continueReading.id}`} className={styles.continueButton}>
                    Retomar leitura
                  </Link>
                </div>
              )}
              {!isLoadingRecent && !isErrorRecent && !continueReading && (
                <div className={styles.historyEmpty}>
                  <p>Seu arquivo está pronto para nascer.</p>
                  <Link to="/tarot" className={styles.historyActionPrimary}>
                    Fazer minha primeira leitura
                  </Link>
                </div>
              )}
            </section>

            <section className={styles.historySection}>
              <GrimorioToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                spreadType={spreadType}
                onSpreadTypeChange={setSpreadType}
                period={period}
                onPeriodChange={setPeriod}
                customRange={customRange}
                onCustomRangeChange={setCustomRange}
                privacy={privacy}
                onPrivacyChange={setPrivacy}
                withComments={withComments}
                onWithCommentsChange={setWithComments}
                withStars={withStars}
                onWithStarsChange={setWithStars}
                totalCount={totalCount}
              />
              {cardFilter && (
                <div className={styles.activeFilter}>
                  <span>Filtrando por carta: {cardFilter}</span>
                  <button type="button" onClick={() => setCardFilter('')}>
                    Limpar filtro
                  </button>
                </div>
              )}
              <ReadingHistoryList
                readings={readings}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetchHistory}
                onLoadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                userId={user?.id}
                queryKey={queryKey}
              />
            </section>

            <div className={styles.insightsMobile}>
              <InsightsPanel insights={derivedInsights} isLoading={isInsightsLoading} variant="accordion" />
            </div>
          </div>

          <div className={styles.insightsColumn}>
            <InsightsPanel insights={derivedInsights} isLoading={isInsightsLoading} />
            <div className={styles.insightsFootnote}>
              Semana iniciada em {weekStart}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuGrimorioPage;
