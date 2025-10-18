import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import { usePublicReadings } from '../../hooks/useReadings';
import ReadingCard from '../../components/ReadingCard/ReadingCard';
import Loader from '../../components/common/Loader/Loader';
import styles from './CommunityFeedPage.module.css';

function CommunityFeedPage() {
  const [sortBy, setSortBy] = useState({ column: 'created_at', ascending: false });

  const {
    pages,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePublicReadings(sortBy);

  const readings = pages.flatMap(page => page.data);

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    992: 2,
    768: 1
  };

  return (
    <div className={`content_wrapper ${styles.pageWrapper}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Leituras da Comunidade</h1>
        <p className={styles.subtitle}>Explore as jornadas e insights compartilhados por outros consulentes.</p>
        
        <div className={styles.controls}>
          <span>Ordenar por:</span>
          <button
            onClick={() => setSortBy({ column: 'created_at', ascending: false })}
            className={sortBy.column === 'created_at' ? styles.active : ''}
          >
            Mais Recentes
          </button>
          <button
            onClick={() => setSortBy({ column: 'stars', ascending: false })}
            className={sortBy.column === 'stars' ? styles.active : ''}
          >
            Mais Populares
          </button>
        </div>
      </header>
      
      {isLoading && <Loader customText="Buscando no Oráculo Coletivo..." />}
      {isError && <p className={styles.error}>Ocorreu um erro: {error.message}</p>}

      {!isLoading && readings.length === 0 && (
        <p className={styles.empty}>Ainda não há leituras na comunidade. Seja o primeiro a compartilhar!</p>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.masonryGrid}
        columnClassName={styles.masonryGrid_column}
      >
        {readings.map(reading => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </Masonry>
      
      {hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Explorar Mais Jornadas'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommunityFeedPage;