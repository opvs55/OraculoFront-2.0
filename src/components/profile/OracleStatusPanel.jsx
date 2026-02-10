import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOracleStatus } from '../../services/oracleStatusService';
import { useAuth } from '../../context/AuthContext';
import styles from './OracleStatusPanel.module.css';

const statusItems = [
  {
    key: 'personalNumerology',
    title: 'Numerologia Pessoal',
    description: 'Leitura one-time baseada na sua data de nascimento.',
    actionPath: '/numerologia',
    doneText: 'Concluído',
    pendingText: 'Fazer agora',
  },
  {
    key: 'natalChart',
    title: 'Mapa Astral Natal',
    description: 'Seu mapa natal one-time para referência da jornada.',
    actionPath: '/mapa-astral',
    doneText: 'Concluído',
    pendingText: 'Fazer agora',
  },
  {
    key: 'weeklyNumerology',
    title: 'Numerologia Semanal',
    description: 'Leitura renovada por semana com week_start.',
    actionPath: '/numerologia',
    doneText: 'Ver leitura da semana',
    pendingText: 'Fazer leitura da semana',
  },
  {
    key: 'unified',
    title: 'Leitura Unificada',
    description: 'Integra oráculos em uma leitura única e salva no histórico.',
    actionPath: '/leitura-unificada',
    doneText: 'Ver última leitura',
    pendingText: 'Iniciar leitura',
  },
];

function StatusCard({ item, status }) {
  const isUnified = item.key === 'unified';
  const isDone = isUnified ? Boolean(status?.last_id) : Boolean(status?.done);

  return (
    <article className={styles.card}>
      <header>
        <h3>{item.title}</h3>
        <span className={isDone ? styles.doneBadge : styles.pendingBadge}>{isDone ? 'Concluído' : 'Pendente'}</span>
      </header>
      <p>{item.description}</p>

      <div className={styles.cardFooter}>
        {isDone ? (
          <Link to={item.actionPath} className={styles.secondaryAction} aria-label={`${item.doneText} em ${item.title}`}>
            {item.doneText}
          </Link>
        ) : (
          <Link to={item.actionPath} className={styles.primaryAction} aria-label={`${item.pendingText} em ${item.title}`}>
            {item.pendingText}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function OracleStatusPanel() {
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['oracle-status', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchOracleStatus(user.id),
  });

  if (isLoading) {
    return (
      <section className={styles.panel}>
        <h2>Painel dos Oráculos</h2>
        <div className={styles.grid}>
          {statusItems.map((item) => (
            <div key={item.key} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.panel}>
        <h2>Painel dos Oráculos</h2>
        <p className={styles.errorText}>Não foi possível carregar os status agora: {error?.message}</p>
        <button type="button" onClick={() => refetch()} className={styles.retryButton} aria-label="Recarregar status dos oráculos">
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <h2>Painel dos Oráculos</h2>
      <p className={styles.subtitle}>Acompanhe seu progresso e continue seu ritual com contexto.</p>
      <div className={styles.grid}>
        {statusItems.map((item) => (
          <StatusCard key={item.key} item={item} status={data?.[item.key]} />
        ))}
      </div>
    </section>
  );
}
