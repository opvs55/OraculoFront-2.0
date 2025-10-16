import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase } from '../../supabaseClient';
import styles from './PainelPage.module.css'; 
import { baralho } from '../../tarotDeck';
import Loader from '../../components/common/Loader/Loader';
// AQUI ESTÁ A CORREÇÃO: O caminho foi ajustado de ../../ para ../../../
import ChangePasswordForm from '../auth/ChangePasswordForm/ChangePasswordForm';

function EditarPerfilPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const { profile, updateProfile, isLoading: isProfileLoading, isUpdating, error: profileError } = useUserProfile(user?.id);
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    const updates = {
      username,
      full_name: fullName,
      avatar_url: avatarUrl,
      bio,
    };

    updateProfile(updates, {
      onSuccess: () => {
        setMessage('Perfil atualizado com sucesso! Redirecionando...');
        setTimeout(() => navigate('/painel'), 2000);
      },
      onError: (error) => {
        console.error("Erro ao atualizar perfil:", error);
        setMessage(`Erro: ${error.message}`);
      }
    });
  };

  const handleRandomCardSelect = () => {
    const randomIndex = Math.floor(Math.random() * baralho.length);
    const randomCard = baralho[randomIndex];
    setAvatarUrl(randomCard.img);
    setShowModal(false);
  };
  
  const handleDeleteAccount = async () => {
    const confirmation = prompt('Esta ação é irreversível e apagará TODOS os seus dados, incluindo leituras e chats. Para confirmar, digite "DELETAR" nesta caixa:');
    if (confirmation !== 'DELETAR') {
      setMessage('Exclusão cancelada.');
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        throw error;
      }
      alert('Sua conta foi excluída permanentemente.');
      await signOut(); 
      navigate('/');
    } catch (error) {
      setMessage(`Erro ao deletar conta: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isProfileLoading) {
    return <Loader customText="Carregando seu perfil..." />;
  }
  
  if (profileError) {
      return <div className="content_wrapper"><p>Ocorreu um erro ao carregar seu perfil: {profileError.message}</p></div>
  }

  return (
    <div className="content_wrapper">
      <div className={styles.editPageContainer}>
        <h1 style={{textAlign: 'center', width: '100%'}}>Editar Perfil</h1>

        <div className={styles.editPageLayout}>
          <section className={styles.avatarSection}>
            <div className={styles.avatarPicker}>
              <p>Seu Arcano de Perfil</p>
              <img 
                src={avatarUrl || 'https://i.imgur.com/6VBx3io.png'} 
                alt="Avatar atual" 
                className={styles.avatarPreview} 
              />
              <button 
                type="button" 
                onClick={() => setShowModal(true)} 
                className={styles.editProfileButton}
                disabled={isUpdating || isDeleting}
              >
                Escolher uma Carta
              </button>
            </div>
          </section>

          <section className={styles.formSection}>
            <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email || ''} disabled />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="username">Nome de Usuário</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nome Completo</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Uma frase que te define..."/>
              </div>
              
              <div className={styles.formActions}>
                <Link to="/painel" className={styles.cancelButton}>Cancelar</Link>
                <button type="submit" className={styles.saveButton} disabled={isUpdating || isDeleting}>
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
            {message && <p className={styles.formMessage} style={{color: message.startsWith('Erro') ? '#ff8a80' : 'lightgreen'}}>{message}</p>}
          </section>
        </div>
        
        <section className={styles.securitySection}>
          <h2>Segurança da Conta</h2>
          <ChangePasswordForm />
        </section>

        <div className={styles.dangerZone}>
          <h3>Área de Perigo</h3>
          <p>A exclusão da conta é permanente e removerá todas as suas leituras e chats. Esta ação não pode ser desfeita.</p>
          <button onClick={handleDeleteAccount} className={styles.deleteButton} disabled={isUpdating || isDeleting}>
            {isDeleting ? 'Processando...' : 'Deletar Minha Conta Permanentemente'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Escolha seu Arcano</h3>
              <button type="button" onClick={handleRandomCardSelect} className={styles.randomCardButton}>
                ✨ Escolher para mim
              </button>
            </div>
            <div className={styles.cardGrid}>
              {baralho.map(carta => (
                <img 
                  key={carta.id} 
                  src={carta.img} 
                  alt={carta.nome} 
                  className={styles.cardOption}
                  onClick={() => {
                    setAvatarUrl(carta.img);
                    setShowModal(false);
                  }}
                />
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className={styles.modalCloseButton}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarPerfilPage;