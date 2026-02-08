import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../supabaseClient';
import styles from './ReadingHistory.module.css';

// Um objeto para traduzir os 'spread_type' para nomes amigáveis
const spreadTypeNames = {
  celticCross: 'Cruz Celta',
  threeCards: '3 Cartas',
  templeOfAphrodite: 'Templo de Afrodite',
  pathChoice: 'Escolha de Caminho',
};

// Função auxiliar para formatar a "pergunta" corretamente
const getQuestionText = (question, spreadType) => {
  let questionObj = question;

  if (typeof question === 'string') {
    try {
      if (question.trim().startsWith('{') && question.trim().endsWith('}')) {
        questionObj = JSON.parse(question);
      } else {
        return question;
      }
    } catch (error) {
      console.warn(
        "Não foi possível fazer parse da string 'question' como JSON no Histórico:",
        error
      );
      return question;
    }
  }

  if (!questionObj) {
    return 'Pergunta não disponível';
  }

  if (spreadType === 'pathChoice' && questionObj?.path1) {
    return `Escolha entre '${questionObj.path1}' e '${questionObj.path2}'`;
  }
  if (
    spreadType === 'templeOfAphrodite' &&
    (questionObj?.name1 || questionObj?.NAME1)
  ) {
    const name1 = questionObj.name1 || questionObj.NAME1;
    const name2 = questionObj.name2 || questionObj.NAME2;
    return `Análise de relação entre ${name1} e ${name2}`;
  }

  if (typeof questionObj === 'string') return questionObj;
  return JSON.stringify(questionObj);
};

function ReadingHistory({ readings, isLoading, isError }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteReadingMutation = useMutation({
    mutationFn: (readingId) =>
      supabase.from('readings').delete().match({ id: readingId, user_id: user.id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['readings', 'history', user.id] }),
  });

  const deleteAllReadingsMutation = useMutation({
    mutationFn: () => supabase.from('readings').delete().eq('user_id', user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings', 'history', user.id] });
      alert('Seu histórico foi apagado.');
    },
  });

  const handleDeleteReading = (readingId, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm('Apagar esta leitura?')) {
      deleteReadingMutation.mutate(readingId);
    }
  };

  const handleDeleteAllReadings = () => {
    if (
      prompt('Isso apagará TODO o seu histórico. Para confirmar, digite "APAGAR TUDO":') ===
      'APAGAR TUDO'
    ) {
      deleteAllReadingsMutation.mutate();
    }
  };

  const renderContent = () => {
    if (isLoading) return <p>Carregando seu histórico...</p>;
    if (isError) {
      return <p style={{ color: 'red' }}>Ocorreu um erro ao buscar seu histórico.</p>;
    }

    if (readings && readings.length === 0) {
      return (
        <div className={styles.noReadings}>
          <p>Você ainda não tem nenhuma leitura salva.</p>
        </div>
      );
    }

    return (
      <div className={styles.readingsList}>
        {readings &&
          readings.map((reading) => (
            <Link
              to={`/leitura/${reading.id}`}
              key={reading.id}
              className={styles.readingCardLink}
            >
              <div className={styles.readingCard}>
                <div>
                  <h3 className={styles.questionTitle}>
                    {getQuestionText(reading.question, reading.spread_type)}
                  </h3>
                  <div className={styles.cardMeta}>
                    <span>
                      {new Date(reading.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={styles.spreadTypeTag}>
                      {spreadTypeNames[reading.spread_type] || 'Tiragem'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(event) => handleDeleteReading(reading.id, event)}
                  className={styles.deleteReadingButton}
                  title="Apagar"
                >
                  🗑️
                </button>
              </div>
            </Link>
          ))}
      </div>
    );
  };

  return (
    <section className={styles.historySection}>
      <h1>Meu Histórico de Leituras</h1>
      <p>Aqui estão todas as suas jornadas. Clique em uma para revisitá-la.</p>
      {renderContent()}
      {readings && readings.length > 0 && (
        <div className={styles.deleteAllContainer}>
          <button
            onClick={handleDeleteAllReadings}
            className={styles.deleteAllButton}
            disabled={deleteAllReadingsMutation.isPending}
          >
            {deleteAllReadingsMutation.isPending
              ? 'Apagando...'
              : 'Apagar Todo o Histórico'}
          </button>
        </div>
      )}
    </section>
  );
}

export default ReadingHistory;
