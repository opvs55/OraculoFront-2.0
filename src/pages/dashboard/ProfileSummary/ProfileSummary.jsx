// src/pages/dashboard/ProfileSummary/ProfileSummary.jsx (VERSÃO CORRIGIDA)

import React, { useEffect } from 'react'; // 1. Importar useEffect
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // 2. Importar useQueryClient
import styles from './ProfileSummary.module.css'; 

// <<< REMOVIDA a importação do .css que não existe >>>
// import defaultAvatar from '../../../assets/default-avatar.png'; // REMOVIDO

function ProfileSummary({ profile, readings, isLoading, lifePathNumber }) { 
  // 3. Inicializar o queryClient
  const queryClient = useQueryClient();

  // 4. --- A SOLUÇÃO PARA O "PISCAR" ---
  // Este efeito "aquece" a cache do perfil público.
  useEffect(() => {
    if (profile && profile.username) {
      // Pré-populamos a query ['publicProfile', profile.username]
      // com os dados que já temos.
      queryClient.setQueryData(['publicProfile', profile.username], profile);
    }
  }, [profile, queryClient]);
  // --- FIM DA ADIÇÃO ---


  // 5. --- O TEU SKELETON LOADER ORIGINAL (MANTIDO) ---
  // Ele estava perfeito, não havia motivo para eu mudar.
  if (isLoading) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.loadingPlaceholder}>
          <div className={styles.avatarPlaceholder}></div>
          <div className={styles.textPlaceholder} style={{ width: '60%' }}></div>
          <div className={styles.textPlaceholder} style={{ width: '80%' }}></div>
          <div className={styles.textPlaceholder} style={{ width: '50%' }}></div>
        </div>
      </div>
    );
  }
  // --- FIM DO SKELETON LOADER ---


  const defaultAvatarUrl = '/assets/default-avatar.png'; 
  const avatarUrl = profile?.avatar_url || defaultAvatarUrl;
  const readingCount = readings?.length || 0;

  return (
    <div className={styles.summaryContainer}> 
      
      {lifePathNumber && ( 
        <div className={styles.lifePathBadge}>
          <span>{lifePathNumber}</span> 
        </div>
      )}

      <img 
        src={avatarUrl} 
        alt={`Avatar de ${profile?.username || 'usuário'}`} 
        className={styles.avatar} 
      />
      <h2 className={styles.username}>{profile?.username || 'Usuário'}</h2> 
      {profile?.bio && <p className={styles.bio}>{profile.bio}</p>} 
      <p className={styles.readingCount}>Leituras Feitas: {readingCount}</p>
      
      <div className={styles.profileActions}>
        <Link to="/perfil/editar" className={styles.editButton}>Editar Perfil</Link> 
        {profile?.username && ( 
          <Link 
            to={`/perfil/${profile.username}`} 
            className={styles.viewProfileButton} 
            // target="_blank"  // Recomendo remover isto para a navegação lisa
            // rel="noopener noreferrer" 
          >
            Ver Perfil Público
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileSummary;