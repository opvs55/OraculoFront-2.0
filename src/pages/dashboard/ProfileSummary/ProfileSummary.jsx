import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileSummary.module.css';

function ProfileSummary({ profile, readings, isLoading }) {
  if (isLoading) {
    return <div className={styles.profileSection}><p>Carregando perfil...</p></div>;
  }

  return (
    <section className={styles.profileSection}>
      <div className={styles.avatarContainer}>
        <img 
          src={profile?.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
          alt="Avatar do usuário" 
          className={styles.avatar}
        />
      </div>
      <div className={styles.profileInfo}>
        <h2>{profile?.full_name || profile?.username}</h2>
        {profile?.username && <p className={styles.username}>@{profile.username}</p>}
        <div className={styles.stats}>
          <span>Leituras Feitas: <strong>{readings ? readings.length : 0}</strong></span>
        </div>
        {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
        <div className={styles.profileActions}>
          <Link to="/perfil/editar" className={styles.editProfileButton}>
            Editar Perfil
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProfileSummary;