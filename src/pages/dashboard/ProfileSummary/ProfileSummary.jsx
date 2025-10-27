// src/pages/dashboard/ProfileSummary/ProfileSummary.jsx (CORRIGIDO)
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileSummary.module.css'; 
// <<< REMOVER a importação da imagem daqui >>>
// import defaultAvatar from '../../../assets/default-avatar.png'; // REMOVIDO

function ProfileSummary({ profile, readings, isLoading, lifePathNumber }) { 

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

  // <<< ALTERAÇÃO: Define a URL padrão diretamente como string >>>
  // Usa o caminho absoluto a partir da raiz do site ('/')
  const defaultAvatarUrl = '/assets/default-avatar.png'; 
  const avatarUrl = profile?.avatar_url || defaultAvatarUrl; // Usa a URL padrão se profile.avatar_url não existir
  
  const readingCount = readings?.length || 0;

  return (
    <div className={styles.summaryContainer}> 
      
      {lifePathNumber && ( 
        <div className={styles.lifePathBadge}>
          <span>{lifePathNumber}</span> 
        </div>
      )}

      {/* A tag img agora usa avatarUrl, que conterá o caminho correto */}
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
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Ver Perfil Público
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileSummary;