import React from 'react';
import styles from './AuthorPost.module.css';

function AuthorPost({ text, username }) {
  if (!text) return null;

  return (
    <div className={styles.authorPost}>
      <h4 className={styles.authorTitle}>Reflexão de @{username}</h4>
      <p className={styles.authorText}>"{text}"</p>
    </div>
  );
}

export default AuthorPost;