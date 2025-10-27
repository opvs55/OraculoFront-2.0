// src/pages/profile/ProfilePage.jsx (RECONSTRUÍDO COM MAIS DADOS)

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import Loader from '../../components/common/Loader/Loader';
import styles from './ProfilePage.module.css'; 

// --- 1. FUNÇÕES AUXILIARES (Reutilizadas da tua página de Numerologia) ---

/**
 * Renderiza texto formatado com quebras de linha e **negrito**.
 */
const renderFormattedText = (text, customClassName = '') => {
  if (!text) return null;
  const regex = /\*\*(.*?)\*\*/g;
  
  return (
    <div className={`${styles.meaningText} ${customClassName}`}>
      {text.split('\n').map((paragraph, pIndex) => {
        const trimmedParagraph = paragraph.trim();
        if (!trimmedParagraph) return null;
        
        const parts = trimmedParagraph.split(regex);
        return (
          <p key={pIndex}>
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
};

/**
 * "Parte" o texto do Caminho de Vida em Essência, Luz, Sombra e Missão.
 */
const parseLifePathMeaning = (lifePathMeaning) => {
  if (!lifePathMeaning) return null;
  const parts = {
    essence: lifePathMeaning.split('* **')[0]?.trim() || '',
    light: lifePathMeaning.match(/\* \*\*Luz:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
    shadow: lifePathMeaning.match(/\* \*\*Sombra:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
    mission: lifePathMeaning.match(/\* \*\*Missão:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || ''
  };
  if (parts.light.startsWith('Luz:**')) parts.light = parts.light.substring(6).trim();
  if (parts.shadow.startsWith('Sombra:**')) parts.shadow = parts.shadow.substring(9).trim();
  if (parts.mission.startsWith('Missão:**')) parts.mission = parts.mission.substring(9).trim();
  
  return parts.essence ? parts : null;
};

/**
 * Faz o parse do JSON do Arquétipo da IA (ou lida com texto antigo).
 */
const parseArchetype = (birthdaySecretMeaning) => {
  if (!birthdaySecretMeaning) return null;
  try {
    const data = JSON.parse(birthdaySecretMeaning);
    if (data.error) return null; 
    return data;
  } catch (e) {
    // Fallback para texto antigo (se não for JSON)
    return {
      archetype_title: "O Arquétipo do Dia",
      archetype_description: birthdaySecretMeaning,
    };
  }
};


// --- 2. HOOKS DE BUSCA DE DADOS ---

/**
 * Hook Principal: Busca dados da tabela 'profiles'.
 */
function usePublicProfile(username) {
  return useQuery({
    queryKey: ['publicProfile', username], 
    queryFn: async () => {
      if (!username) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, username, full_name, avatar_url, bio,
          minha_historia, entidade_cultuada,
          life_path_number, birthday_number 
        `) 
        .eq('username', username)
        .single(); 

      if (error && error.code === 'PGRST116') throw new Error('Perfil não encontrado.');
      else if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!username, 
    staleTime: 1000 * 60 * 5, 
  });
}

/**
 * NOVO Hook: Busca contagem de leituras.
 */
function usePublicReadingCount(userId) {
  return useQuery({
    queryKey: ['publicReadingCount', userId],
    queryFn: async () => {
      if (!userId) return null;
      // 'head: true' otimiza para pedir SÓ a contagem
      const { count, error } = await supabase
        .from('readings')
        .select('*', { count: 'exact', head: true }) 
        .eq('user_id', userId);
      if (error) throw error;
      return count;
    },
    enabled: !!userId, 
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * NOVO Hook: Busca os significados da numerologia.
 */
function usePublicNumerology(userId) {
  return useQuery({
    queryKey: ['publicNumerology', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('numerology_readings')
        .select('life_path_meaning, birthday_secret_meaning')
        .eq('user_id', userId)
        .maybeSingle(); // Pode ser nulo
      if (error) throw error;
      return data;
    },
    enabled: !!userId, 
    staleTime: 1000 * 60 * 60, // 1 hora de cache
  });
}


// --- 3. COMPONENTE PRINCIPAL ---

function ProfilePage() {
  const { username } = useParams(); 
  const navigate = useNavigate(); 
  const location = useLocation(); 

  // Busca o perfil base
  const { data: profile, isLoading: isLoadingProfile, isError, error } = usePublicProfile(username);
  
  // Obtém o ID do perfil (se existir)
  const profileId = profile?.id;

  // Busca os dados extras (só rodam se 'profileId' existir)
  const { data: readingCount, isLoading: isLoadingCount } = usePublicReadingCount(profileId);
  const { data: numerology, isLoading: isLoadingNumerology } = usePublicNumerology(profileId);

  // Função "Voltar"
  const handleBackClick = () => {
    if (location.key !== "default") navigate(-1); 
    else navigate('/'); 
  };

  /**
   * Renderiza o cartão do Arquétipo (reutilizado)
   */
  const renderArchetypeCard = (archetypeData) => {
    // Se for texto antigo (sem o layout JSON), usa formatação simples
    if (!archetypeData.numerology_details) {
      return (
        <div className={styles.cardSubSection}>
          {renderFormattedText(archetypeData.archetype_description)}
        </div>
      );
    }
    // Se for o layout JSON completo (o formato novo, como na image_e57d85.png)
    return (
      <div className={styles.archetypeGridContainer}>
        {/* Coluna Principal (Texto) */}
        <div className={styles.archetypeMain}>
          <div className={styles.archetypeSection}>
            {renderFormattedText(archetypeData.archetype_description)}
          </div>
          {archetypeData.numerology_details && (
            <div className={styles.archetypeSection}>
              <h4>Numerologia e Planetas</h4>
              {renderFormattedText(archetypeData.numerology_details)}
            </div>
          )}
          {archetypeData.tarot_card && (
            <div className={styles.archetypeSection}>
              <h4>Tarot</h4>
              {renderFormattedText(archetypeData.tarot_card)}
            </div>
          )}
        </div>
        {/* Coluna Lateral (Listas) */}
        <div className={styles.archetypeSidebar}>
          {archetypeData.advice && (
            <div className={`${styles.archetypeListCard} ${styles.adviceCard}`}>
              <h5>Conselho</h5>
              {renderFormattedText(archetypeData.advice)}
            </div>
          )}
          {archetypeData.strengths?.length > 0 && (
            <div className={`${styles.archetypeListCard} ${styles.strengthsCard}`}>
              <h5>Pontos Fortes</h5>
              <ul className={styles.archetypeList}>
                {archetypeData.strengths.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
          {archetypeData.weaknesses?.length > 0 && (
            <div className={`${styles.archetypeListCard} ${styles.weaknessesCard}`}>
              <h5>Pontos Fracos</h5>
              <ul className={styles.archetypeList}>
                {archetypeData.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renderização principal
   */
  const renderContent = () => {
    // Graças ao "aquecimento" da cache, este 'isLoadingProfile'
    // raramente será 'true' ao vir do Grimório.
    // Combinamos todos os loaders.
    if (isLoadingProfile || isLoadingCount || isLoadingNumerology) {
      return <Loader customText={`Carregando perfil de @${username}...`} />;
    }

    if (isError) {
      return (
        <div className={styles.notFound}>
          <h1>Erro</h1>
          <p>{error.message === 'Perfil não encontrado.' ? `O perfil @${username} não existe.` : 'Ocorreu um erro ao carregar o perfil.'}</p>
        </div>
      );
    }

    if (profile) {
      // Prepara os dados de numerologia (pode ser null)
      const lifePathParts = parseLifePathMeaning(numerology?.life_path_meaning);
      const archetypeData = parseArchetype(numerology?.birthday_secret_meaning);

      return (
        <div className={styles.profileLayoutGrid}>
          
          {/* --- Coluna da Esquerda (Avatar e Bio) --- */}
          <aside className={styles.profileLeftColumn}>
            <img 
              src={profile.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
              alt={`Avatar de ${profile.username}`}
              className={styles.profileAvatar}
            />
            <h1 className={styles.profileFullName}>{profile.full_name || profile.username}</h1>
            <p className={styles.profileUsername}>@{profile.username}</p>
            
            {profile.bio && (
              <p className={styles.profileBio}>"{profile.bio}"</p>
            )}

            {/* --- NOVO CARTÃO DE ESTATÍSTICAS --- */}
            <div className={styles.statsCard}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{profile.life_path_number || '-'}</span>
                <span className={styles.statLabel}>Caminho de Vida</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{readingCount ?? '-'}</span>
                <span className={styles.statLabel}>Leituras Feitas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{profile.birthday_number || '-'}</span>
                <span className={styles.statLabel}>Dia Nascimento</span>
              </div>
            </div>
            {/* --- FIM DO CARTÃO --- */}
            
            <button onClick={handleBackClick} className={styles.backButton}>← Voltar</button>
          </aside>

          {/* --- Coluna da Direita (Números e História) --- */}
          <main className={styles.profileRightColumn}>
            
            {/* --- NOVO CARTÃO CAMINHO DE VIDA --- */}
            {lifePathParts && (
              <section className={`${styles.profileSection} ${styles.numerologyCard}`}>
                <h2>Caminho de Vida: {profile.life_path_number}</h2>
                <div className={styles.cardSubSection}>
                  <h4>Essência da Jornada:</h4>
                  {renderFormattedText(lifePathParts.essence)}
                </div>
                {lifePathParts.light && (<div className={styles.cardSubSection}> <h4 className={styles.lightTitle}>Luz:</h4> {renderFormattedText(lifePathParts.light)} </div>)}
                {lifePathParts.shadow && (<div className={styles.cardSubSection}> <h4 className={styles.shadowTitle}>Sombra:</h4> {renderFormattedText(lifePathParts.shadow)} </div>)}
                {lifePathParts.mission && (<div className={styles.cardSubSection}> <h4 className={styles.missionTitle}>Missão:</h4> {renderFormattedText(lifePathParts.mission)} </div>)}
              </section>
            )}
            
            {/* --- NOVO CARTÃO ARQUÉTIPO --- */}
            {archetypeData && (
              <section className={`${styles.profileSection} ${styles.archetypeCard}`}>
                <h2>{archetypeData.archetype_title || "Arquétipo do Aniversário"}</h2>
                {renderArchetypeCard(archetypeData)}
              </section>
            )}

            {/* --- Cartões Originais --- */}
            {profile.entidade_cultuada && (
              <section className={styles.profileSection}>
                <h2>Cultua / Admira</h2>
                <p>{profile.entidade_cultuada}</p>
              </section>
            )}

            {profile.minha_historia && (
              <section className={styles.profileSection}>
                <h2>Minha História</h2>
                <div className={styles.storyText}>
                  {profile.minha_historia.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph || '\u00A0'}</p> 
                  ))}
                </div>
              </section>
            )}

          </main>
        </div>
      );
    }
    return null;
  };

  return (
    // O wrapper renderiza instantaneamente
    <div className={`content_wrapper ${styles.profileGridWrapper}`}> 
      <div className={styles.profileContainer}>
        {renderContent()}
      </div>
    </div>
  );
}

export default ProfilePage;