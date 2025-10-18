import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileSummary.module.css';

function ProfileSummary({ profile, readings, isLoading }) {
  // Mostra um estado de carregamento simplificado
  if (isLoading) {
    return (
      <section className={styles.profileSection} style={{ minHeight: '300px' }}> {/* Ajuste a altura mínima se necessário */}
        <p>Carregando perfil...</p>
      </section>
    );
  }

  // Se o perfil não for encontrado ou houver erro
  if (!profile) {
     return (
       <section className={styles.profileSection}>
         <p>Complete seu perfil para uma experiência completa.</p>
         <Link to="/perfil/editar" className={styles.editProfileButton}>
            Criar/Editar Perfil
         </Link>
       </section>
     );
  }

  // Renderização do resumo simplificado
  return (
    <section className={styles.profileSection}>
      <div className={styles.avatarContainer}>
        {/* Link na imagem do avatar para o perfil completo */}
        <Link to={`/perfil/${profile.username}`}>
          <img 
            src={profile.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
            alt="Avatar do usuário" 
            className={styles.avatar}
          />
        </Link>
      </div>
      <div className={styles.profileInfo}>
        {/* Link no nome do usuário para o perfil completo */}
        <Link to={`/perfil/${profile.username}`} className={styles.profileNameLink}>
          <h2>{profile.full_name || profile.username}</h2>
        </Link>
        {profile.username && (
          <p className={styles.username}>
             <Link to={`/perfil/${profile.username}`}>@{profile.username}</Link>
          </p>
        )}
        
        {/* Bio (limitada a poucas linhas) */}
        {profile.bio && <p className={styles.bio}>"{profile.bio}"</p>}

        {/* Estatísticas */}
        <div className={styles.stats}>
          <span>Leituras Feitas: <strong>{readings ? readings.length : 0}</strong></span>
        </div>

        {/* Botão Editar Perfil */}
        <div className={styles.profileActions}>
          <Link to="/perfil/editar" className={styles.editProfileButton}>
            Editar Perfil
          </Link>
          {/* Adiciona um link sutil para ver o perfil completo, caso o nome não seja clicado */}
          <Link to={`/perfil/${profile.username}`} className={styles.viewProfileLink}>
            Ver Perfil Completo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProfileSummary;