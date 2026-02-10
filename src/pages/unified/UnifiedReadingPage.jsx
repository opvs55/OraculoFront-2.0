import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUnifiedReading } from '../../features/unified/useUnifiedReading';
import styles from './UnifiedReadingPage.module.css';

export default function UnifiedReadingPage() {
  const { user } = useAuth();
  const [intention, setIntention] = useState('');
  const [latest, setLatest] = useState(null);
  const { createUnifiedReading, isCreatingUnifiedReading, errorCreatingUnifiedReading } = useUnifiedReading();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    const payload = {
      userId: user.id,
      intention,
      weekRef: new Date().toISOString().slice(0, 10),
      modules: ['tarot', 'numerology', 'astrology'],
    };

    const created = await createUnifiedReading({ inputPayload: payload });
    setLatest(created);
  };

  return (
    <div className={`content_wrapper ${styles.container}`}>
      <div className={styles.content}>
        <h1>Leitura Unificada</h1>
        <p>Una seus oráculos em uma mensagem integrada e contextual.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="intention">Sua intenção para a leitura</label>
          <textarea
            id="intention"
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            placeholder="Ex: Quero clareza para minhas decisões desta semana"
          />
          <button type="submit" disabled={isCreatingUnifiedReading} aria-label="Iniciar leitura unificada">
            {isCreatingUnifiedReading ? 'Canalizando...' : 'Iniciar leitura'}
          </button>
        </form>

        {errorCreatingUnifiedReading && (
          <div className={styles.errorBox}>
            <p>{errorCreatingUnifiedReading.message}</p>
            <p>Tente novamente.</p>
          </div>
        )}

        {latest && (
          <div className={styles.resultBox}>
            <h2>Última leitura criada</h2>
            <p>ID: {latest.id}</p>
            <p>Criada em: {latest.created_at}</p>
          </div>
        )}
      </div>
    </div>
  );
}
