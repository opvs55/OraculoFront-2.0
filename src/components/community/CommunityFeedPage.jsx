// src/pages/community/CommunityFeedPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import Loader from '../../components/common/Loader/Loader';
import styles from './CommunityFeedPage.module.css'; // Vamos criar este arquivo a seguir

// Hook para buscar as leituras públicas com perfis (lógica de 2 etapas)
function usePublicReadingsWithProfiles() {
  return useQuery({
    queryKey: ['publicReadingsWithProfiles'], // Nova chave de cache
    queryFn: async () => {
      // ETAPA 1: Buscar as leituras públicas
      const { data: readingsData, error: readingsError } = await supabase
        .from('readings')
        .select('id, created_at, question, spread_type, user_id, shared_title') // Adicionado shared_title
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (readingsError) {
        console.error("Erro ao buscar leituras públicas:", readingsError);
        throw readingsError;
      }

      if (!readingsData || readingsData.length === 0) {
        return []; // Retorna array vazio se não houver leituras
      }

      // ETAPA 2: Extrair os IDs dos autores
      const authorIds = [...new Set(readingsData.map(r => r.user_id).filter(id => id != null))]; 

      // ETAPA 3: Buscar os perfis correspondentes
      let profilesMap = {}; 
      if (authorIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url') 
          .in('id', authorIds); 

        if (profilesError) {
          console.error("Erro ao buscar perfis dos autores:", profilesError);
        } else {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }
      }
      
      // ETAPA 4: Combinar os dados
      const combinedData = readingsData.map(reading => {
        const authorProfile = profilesMap[reading.user_id] || { username: 'Anônimo', avatar_url: null }; 
        return {
          ...reading,
          profiles: authorProfile, 
        };
      });

      return combinedData;
    },
    staleTime: 1000 * 60 * 2, // Cache de 2 minutos
  });
}

// Objeto para traduzir os 'spread_type'
const spreadTypeNames = {
  celticCross: 'Cruz Celta',
  threeCards: '3 Cartas',
  templeOfAphrodite: 'Templo de Afrodite',
  pathChoice: 'Escolha de Caminho',
};


function CommunityFeedPage() {
  const { data: publicReadings, isLoading, isError, error } = usePublicReadingsWithProfiles(); 

  return (
    <div className={`content_wrapper ${styles.feedContainer}`}>
      <h1 className={styles.mainTitle}>Leituras da Comunidade</h1>
      <p className={styles.subtitle}>Explore as jornadas e insights compartilhados por outros consulentes.</p>

      {isLoading && <Loader customText="Buscando leituras compartilhadas..." />}
      {isError && <p className={styles.error}>Ocorreu um erro ao carregar o feed: {error?.message || 'Erro desconhecido'}</p>}
      {!isLoading && !isError && publicReadings?.length === 0 && (
        <p className={styles.noReadings}>Nenhuma leitura foi compartilhada ainda. Seja o primeiro!</p>
      )}

      {!isLoading && !isError && publicReadings && publicReadings.length > 0 && (
        <div className={styles.readingsGrid}>
          {publicReadings.map(reading => (
            // Link para a página da leitura individual
            <Link to={`/leitura/${reading.id}`} key={reading.id} className={styles.readingCardLink}>
              <div className={styles.readingCard}>
                {/* Cabeçalho do Card com Avatar e Username */}
                <div className={styles.cardHeader}>
                  <img
                    src={reading.profiles?.avatar_url || 'https://i.imgur.com/6VBx3io.png'}
                    alt={`Avatar de ${reading.profiles?.username || 'Usuário'}`}
                    className={styles.userAvatar}
                  />
                  <span className={styles.username}>
                    @{reading.profiles?.username || 'Usuário'} 
                  </span>
                </div>

                {/* Pergunta ou Título da Leitura */}
                <h3 className={styles.question}>
                  {reading.shared_title || // Prioriza o título compartilhado
                   (typeof reading.question === 'string' 
                    ? reading.question 
                    : `Escolha: '${reading.question?.path1 || '...'}' vs '${reading.question?.path2 || '...'}'`)
                  }
                </h3>

                {/* Rodapé do Card com Tipo de Tiragem e Data */}
                <div className={styles.cardFooter}>
                  <span className={styles.spreadTypeTag}>
                    {spreadTypeNames[reading.spread_type] || 'Tiragem'}
                  </span>
                  <span className={styles.date}>
                    {new Date(reading.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityFeedPage;