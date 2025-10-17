import React from 'react';
import styles from './DecorativeDivider.module.css';

function DecorativeDivider() {
  return (
    <div className={styles.dividerContainer}>
      <svg className={styles.dividerSvg} width="200" height="20" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="10" x2="85" y2="10" />
        <path d="M95 10 L100 15 L105 10 L100 5 Z" />
        <line x1="115" y1="10" x2="200" y2="10" />
      </svg>
    </div>
  );
}

export default DecorativeDivider;