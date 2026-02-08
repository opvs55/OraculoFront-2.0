import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase } from '../../supabaseClient';
import styles from './EditarPerfilPage.module.css';
import { baralho } from '../../tarotDeck';
import Loader from '../../components/common/Loader/Loader';
import ChangePasswordForm from '../../pages/auth/ChangePasswordForm/ChangePasswordForm';

const requiredFieldLabels = {
  username: 'Nome de Usuário',
  fullName: 'Nome Completo',
  bio: 'Bio',
  minhaHistoria: 'Minha História',
  entidadeCultuada: 'Entidade(s) que Cultuo/Admiro',
};

const getRandomCard = () => baralho[Math.floor(Math.random() * baralho.length)];

function EditarPerfilPage() {
  const { user, signOut, needsOnboarding } = useAuth();
  const navigate = useNavigate();

  const {
    profile,
    updateProfile,
    isLoading: isProfileLoading,
    isUpdating,
    error: profileError,
  } = useUserProfile(user?.id);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [minhaHistoria, setMinhaHistoria] = useState('');
  const [entidadeCultuada, setEntidadeCultuada] = useState('');

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const missingFieldsLabel = useMemo(() => {
    const missing = [];

    if (!username.trim()) missing.push(requiredFieldLabels.username);
    if (!fullName.trim()) missing.push(requiredFieldLabels.fullName);
    if (!bio.trim()) missing.push(requiredFieldLabels.bio);
    if (!minhaHistoria.trim()) missing.push(requiredFieldLabels.minhaHistoria);
    if (!entidadeCultuada.trim()) missing.push(requiredFieldLabels.entidadeCultuada);
    if (!avatarUrl.trim()) missing.push('Arcano de Perfil');

    return missing;
  }, [avatarUrl, bio, entidadeCultuada, fullName, minhaHistoria, username]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
      setMinhaHistoria(profile.minha_historia || '');
      setEntidadeCultuada(profile.entidade_cultuada || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setMessage('');

    if (missingFieldsLabel.length > 0) {
      setMessage(
        `Preencha os campos obrigatórios: ${missingFieldsLabel.join(', ')}.`
      );
      return;
    }

    let updatedAvatarUrl = avatarUrl;
    let updatedCardOfTheWeek = profile?.card_of_the_week ?? null;
    let randomCardMessage = '';

    if (!updatedAvatarUrl) {
      const randomCard = getRandomCard();
      updatedAvatarUrl = randomCard.img;
      updatedCardOfTheWeek = { id: randomCard.id };
      randomCardMessage = 'Definimos um arcano automaticamente para você.';
    } else if (!updatedCardOfTheWeek) {
      const randomCard = getRandomCard();
      updatedCardOfTheWeek = { id: randomCard.id };
    }

    const updates = {
      username,
      full_name: fullName,
      avatar_url: updatedAvatarUrl,
      bio,
      minha_historia: minhaHistoria,
      entidade_cultuada: entidadeCultuada,
      card_of_the_week: updatedCardOfTheWeek,
    };

    updateProfile(updates, {
      onSuccess: () => {
        const successMessage = randomCardMessage
          ? `Perfil atualizado com sucesso! ${randomCardMessage}`
          : 'Perfil atualizado com sucesso!';
        setMessage(successMessage);
        setTimeout(() => navigate('/meu-grimorio'), 2000);
      },
      onError: (error) => {
        console.error('Erro ao atualizar perfil:', error);
        setMessage(`Erro ao atualizar: ${error.message}`);
      },
    });
  };

  const handleRandomCardSelect = () => {
    const randomCard = getRandomCard();
    setAvatarUrl(randomCard.img);
    setShowModal(false);
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'Esta ação é irreversível e apagará TODOS os seus dados, incluindo leituras e chats. Para confirmar, digite "DELETAR" nesta caixa:'
    );
    if (confirmation !== 'DELETAR') {
      setMessage('Exclusão cancelada.');
      return;
    }

    setIsDeleting(true);
    setMessage('');
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        throw error;
      }
      alert('Sua conta foi excluída permanentemente.');
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      setMessage(`Erro ao deletar conta: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isProfileLoading) return <Loader customText="Carregando seu perfil..." />;
  if (profileError) {
    return (
      <div className="content_wrapper">
        <p>Ocorreu um erro ao carregar seu perfil: {profileError.message}</p>
      </div>
    );
  }

  return (
    <div className="content_wrapper">
      <div className={styles.editPageContainer}>
        <header className={styles.pageHeader}>
          <h1>Editar Perfil</h1>
          {needsOnboarding && (
            <p className={styles.onboardingNotice}>
              Complete seu perfil para desbloquear todas as funcionalidades.
            </p>
          )}
        </header>

        <div className={styles.editPageLayout}>
          {/* Coluna da Esquerda: Avatar */}
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
              <button
                type="button"
                onClick={handleRandomCardSelect}
                className={styles.randomAvatarButton}
                disabled={isUpdating || isDeleting}
              >
                Sortear arcano automaticamente
              </button>
            </div>
          </section>

          {/* Coluna da Direita: Agrupa Formulário, Segurança e Danger Zone */}
          <section className={styles.formSection}>
            {/* Formulário de Perfil */}
            <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email || ''} disabled />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="username">Nome de Usuário</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nome Completo</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Uma frase que te define..."
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="minhaHistoria">Minha História</label>
                <textarea
                  id="minhaHistoria"
                  value={minhaHistoria}
                  onChange={(event) => setMinhaHistoria(event.target.value)}
                  placeholder="Conte um pouco sobre sua jornada espiritual ou quem você é..."
                  rows="5"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="entidadeCultuada">Entidade(s) que Cultuo/Admiro</label>
                <input
                  id="entidadeCultuada"
                  type="text"
                  value={entidadeCultuada}
                  onChange={(event) => setEntidadeCultuada(event.target.value)}
                  placeholder="Ex: Hécate, Odin, Orixás, Arquétipos..."
                  required
                />
              </div>
              <div className={styles.formActions}>
                <Link to="/meu-grimorio" className={styles.cancelButton}>
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
            {message && (
              <p
                className={styles.formMessage}
                style={{ color: message.startsWith('Erro') ? '#ff8a80' : 'lightgreen' }}
              >
                {message}
              </p>
            )}

            {/* Seção de Segurança (DENTRO da coluna direita) */}
            <section className={styles.securitySection}>
              <h2>Segurança da Conta</h2>
              <ChangePasswordForm />
            </section>

            {/* Área de Perigo (DENTRO da coluna direita) */}
            <div className={styles.dangerZone}>
              <h3>Área de Perigo</h3>
              <p>
                A exclusão da conta é permanente e removerá todas as suas leituras e chats. Esta
                ação não pode ser desfeita.
              </p>
              <button
                onClick={handleDeleteAccount}
                className={styles.deleteButton}
                disabled={isUpdating || isDeleting}
              >
                {isDeleting ? 'Processando...' : 'Deletar Minha Conta Permanentemente'}
              </button>
            </div>
          </section>
        </div>

        {/* Modal (fora do grid principal) */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Escolha seu Arcano</h3>
                <button
                  type="button"
                  onClick={handleRandomCardSelect}
                  className={styles.randomCardButton}
                >
                  ✨ Escolher para mim
                </button>
              </div>
              <div className={styles.cardGrid}>
                {baralho.map((carta) => (
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
              <button onClick={() => setShowModal(false)} className={styles.modalCloseButton}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarPerfilPage;
