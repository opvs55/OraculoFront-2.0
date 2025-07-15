// src/pages/dashboard/PainelPage.jsx - VERSÃO COM A CORREÇÃO FINAL

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useReadingsHistory } from '../../hooks/useReadings';
import { supabase } from '../../supabaseClient';
import styles from './PainelPage.module.css';
import Loader from '../../components/common/Loader/Loader';

function PainelPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, loading: authLoading, signOut } = useAuth();
  
  // AQUI ESTÁ A CORREÇÃO:
  // Removemos o "data:" para desestruturar diretamente o objeto 'profile' que o hook retorna.
  const { profile, isLoading: profileLoading } = useUserProfile(user?.id);
  
  const { data: readings, isLoading: historyLoading, isError } = useReadingsHistory(user?.id);

  // --- As mutations e handlers abaixo já estão corretos ---
  const deleteReadingMutation = useMutation({
    mutationFn: (readingId) => supabase.from('readings').delete().match({ id: readingId, user_id: user.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings', 'history', user.id] });
    },
    onError: (error) => alert(`Erro ao apagar leitura: ${error.message}`),
  });

  const deleteAllReadingsMutation = useMutation({
    mutationFn: () => supabase.from('readings').delete().eq('user_id', user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings', 'history', user.id] });
      alert('Seu histórico de leituras foi apagado com sucesso.');
    },
    onError: (error) => alert(`Erro ao apagar o histórico: ${error.message}`),
  });

  const handleDeleteReading = (readingId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar esta leitura permanentemente?')) {
      deleteReadingMutation.mutate(readingId);
    }
  };

  const handleDeleteAllReadings = () => {
    const confirmation = prompt('Atenção! Isso apagará TODO o seu histórico. Para confirmar, digite "APAGAR TUDO":');
    if (confirmation === 'APAGAR TUDO') {
      deleteAllReadingsMutation.mutate();
    } else {
      alert('Exclusão cancelada.');
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="content_wrapper">
      <section className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          {profileLoading ? (
            <div className={styles.avatarSkeleton} />
          ) : (
            <img 
              src={profile?.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
              alt="Avatar do usuário" 
              className={styles.avatar}
            />
          )}
        </div>
        <div className={styles.profileInfo}>
          <h2>{profileLoading ? "Carregando..." : (profile?.full_name || profile?.username || user?.email)}</h2>
          {profile?.username && <p className={styles.username}>@{profile.username}</p>}
          <div className={styles.stats}>
            <span>Leituras Feitas: <strong>{historyLoading ? '...' : (readings ? readings.length : 0)}</strong></span>
          </div>
          {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
          <div className={styles.profileActions}>
            <Link to="/perfil/editar" className={styles.editProfileButton}>
              Editar Perfil
            </Link>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              Sair
            </button>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.historySection}>
        <h1>Meu Histórico de Leituras</h1>
        <p>Aqui estão todas as suas jornadas. Clique em uma para revisitá-la.</p>
        
        <div className={styles.readingsList}>
          {historyLoading && <p>Carregando seu histórico...</p>}
          {isError && <p style={{color: 'red'}}>Ocorreu um erro ao buscar seu histórico.</p>}
          
          {readings && readings.length === 0 && (
            <div className={styles.noReadings}>
              <p>Você ainda não tem nenhuma leitura salva.</p>
              <Link to="/" className={styles.newReadingButton}>Fazer minha primeira leitura</Link>
            </div>
          )}
          
          {readings && readings.map((reading) => (
            <Link to={`/leitura/${reading.id}`} key={reading.id} className={styles.readingCardLink}>
              <div className={styles.readingCard}>
                <div>
                  <h3>{reading.question}</h3>
                  <p>Feita em: {new Date(reading.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <button 
                  onClick={(e) => handleDeleteReading(reading.id, e)} 
                  className={styles.deleteReadingButton} 
                  title="Apagar esta leitura"
                  disabled={deleteReadingMutation.isPending}
                >
                  🗑️
                </button>
              </div>
            </Link>
          ))}
        </div>

        {readings && readings.length > 0 && (
          <div className={styles.deleteAllContainer}>
            <button 
              onClick={handleDeleteAllReadings} 
              className={styles.deleteAllButton}
              disabled={deleteAllReadingsMutation.isPending}
            >
              {deleteAllReadingsMutation.isPending ? 'Apagando...' : 'Apagar Todo o Histórico'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default PainelPage;