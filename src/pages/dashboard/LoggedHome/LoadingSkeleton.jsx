import React from 'react';
import styles from '../MeuGrimorioPage.module.css';

function LoadingSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {[1, 2, 3].map((item) => (
        <div key={item} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
          <div className={styles.skeletonButton} />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
