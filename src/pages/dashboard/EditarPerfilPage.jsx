import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase } from '../../supabaseClient';
import styles from './EditarPerfilPage.module.css'; 
import { baralho } from '../../tarotDeck';
import Loader from '../../components/common/Loader/Loader';
import ChangePasswordForm from '../../pages/auth/ChangePasswordForm/ChangePasswordForm';
import { getMissingProfileFields, isProfileComplete } from '../../utils/profileCompletion';

function EditarPerfilPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const { profile, updateProfile, isLoading: isProfileLoading, isUpdating, error: profileError } = useUserProfile(user?.id);
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [minhaHistoria, setMinhaHistoria] = useState(''); 
  const [entidadeCultuada, setEntidadeCultuada] = useState(''); 

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasAutoSelectedAvatar = useRef(false);

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

  useEffect(() => {
    if (!profile || profile.avatar_url || hasAutoSelectedAvatar.current) return;
    const randomIndex = Math.floor(Math.random() * baralho.length);
    const randomCard = baralho[randomIndex];
    hasAutoSelectedAvatar.current = true;
    setAvatarUrl(randomCard.img);
    updateProfile({ avatar_url: randomCard.img });
  }, [profile, updateProfile]);

  const formProfile = useMemo(() => ({
    username,
    full_name: fullName,
    bio,
    minha_historia: minhaHistoria,
    entidade_cultuada: entidadeCultuada,
    avatar_url: avatarUrl,
  }), [username, fullName, bio, minhaHistoria, entidadeCultuada, avatarUrl]);

  const missingFields = useMemo(() => {
    const labels = {
      username: 'Nome de usuário',
      full_name: 'Nome completo',
      bio: 'Bio',
      minha_historia: 'Minha história',
      entidade_cultuada: 'Entidade(s) que cultuo/admiro',
      avatar_url: 'Arcano de perfil',
    };
    return getMissingProfileFields(formProfile, labels);
  }, [formProfile]);

  const isFirstLogin = !isProfileComplete(profile);
  const isMessageError = message
    ? message.toLowerCase().startsWith('erro') || message.startsWith('Preencha') || message.startsWith('Exclusão')
    : false;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    if (missingFields.length) {
      setMessage(`Preencha todos os campos obrigatórios para continuar: ${missingFields.join(', ')}.`);
      return;
    }

    const updates = {
      username,
      full_name: fullName,
      avatar_url: avatarUrl,
      bio,
      minha_historia: minhaHistoria, 
      entidade_cultuada: entidadeCultuada, 
    };

    updateProfile(updates, {
      onSuccess: () => {
        setMessage('Perfil atualizado com sucesso! Boas-vindas e boas leituras. Redirecionando...');
        setTimeout(() => navigate('/meu-grimorio'), 2000); 
      },
      onError: (error) => {
        console.error("Erro ao atualizar perfil:", error);
        setMessage(`Erro ao atualizar: ${error.message}`);
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
      console.error("Erro ao deletar conta:", error)
      setMessage(`Erro ao deletar conta: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isProfileLoading) return <Loader customText="Carregando seu perfil..." />;
  if (profileError) return <div className="content_wrapper"><p>Ocorreu um erro ao carregar seu perfil: {profileError.message}</p></div>

  return (
    <div className="content_wrapper"> 
      <div className={styles.editPageContainer}>
        <div className={styles.pageHeader}>
          <div>
            <h1>Editar Perfil</h1>
            <p>Seu perfil é a sua carta de apresentação no oráculo. Capriche nos detalhes.</p>
          </div>
          {isFirstLogin && (
            <span className={styles.firstLoginBadge}>Primeiro acesso</span>
          )}
        </div>

        {isFirstLogin && (
          <section className={styles.welcomeCard}>
            <h2>Bem-vindo(a) ao seu primeiro acesso!</h2>
            <p>
              Este é o seu espaço sagrado para registrar leituras, acompanhar sua evolução e compartilhar
              aprendizados com a comunidade. Para liberar todas as experiências, precisamos que você complete
              o perfil agora. <strong>Todos os campos são obrigatórios.</strong>
            </p>
            <p className={styles.welcomeHint}>
              Assim que salvar, você será redirecionado para o seu grimório e poderá iniciar suas leituras.
            </p>
          </section>
        )}

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
              <p className={styles.avatarHint}>Escolha uma carta que represente sua energia para a comunidade.</p>
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

          {/* Coluna da Direita: Agrupa Formulário, Segurança e Danger Zone */}
          <section className={styles.formSection}> 
            {/* Formulário de Perfil */}
            <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
              <div className={styles.formHeader}>
                <h2>Informações obrigatórias</h2>
                <p>Preencha todos os campos para liberar o acesso completo à plataforma.</p>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email || ''} disabled />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="username">Nome de Usuário</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nome Completo</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Uma frase que te define..." required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="minhaHistoria">Minha História</label>
                <textarea 
                  id="minhaHistoria" 
                  value={minhaHistoria} 
                  onChange={(e) => setMinhaHistoria(e.target.value)} 
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
                  onChange={(e) => setEntidadeCultuada(e.target.value)} 
                  placeholder="Ex: Hécate, Odin, Orixás, Arquétipos..."
                  required
                />
              </div>
              <div className={styles.formActions}>
                <Link to="/meu-grimorio" className={styles.cancelButton}>Cancelar</Link> 
                <button type="submit" className={styles.saveButton} disabled={isUpdating || isDeleting}>
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
            {message && (
              <p className={styles.formMessage} style={{color: isMessageError ? '#ff8a80' : 'lightgreen'}}>
                {message}
              </p>
            )}

            {/* Seção de Segurança (DENTRO da coluna direita) */}
            <details className={styles.accordionSection}>
              <summary>
                <span>Segurança da Conta</span>
                <span className={styles.accordionHint}>Alterar senha</span>
              </summary>
              <div className={styles.accordionContent}>
                <ChangePasswordForm />
              </div>
            </details>

            {/* Área de Perigo (DENTRO da coluna direita) */}
            <details className={`${styles.accordionSection} ${styles.dangerAccordion}`}>
              <summary>
                <span>Área de Perigo</span>
                <span className={styles.accordionHint}>Excluir conta</span>
              </summary>
              <div className={styles.accordionContent}>
                <div className={styles.dangerZone}>
                  <p>A exclusão da conta é permanente e removerá todas as suas leituras e chats. Esta ação não pode ser desfeita.</p>
                  <button onClick={handleDeleteAccount} className={styles.deleteButton} disabled={isUpdating || isDeleting}>
                    {isDeleting ? 'Processando...' : 'Deletar Minha Conta Permanentemente'}
                  </button>
                </div>
              </div>
            </details>
          </section> {/* Fechamento CORRETO da formSection */}
        </div> {/* Fechamento do editPageLayout */}

      {/* Modal (fora do grid principal) - CÓDIGO COMPLETO AGORA */}
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
                /> // Certifique-se de que a tag img está auto-fechada corretamente
              ))}
            </div> {/* Fechamento do cardGrid */}
            <button onClick={() => setShowModal(false)} className={styles.modalCloseButton}>Fechar</button>
          </div> {/* Fechamento do modalContent */}
        </div> // Fechamento do modalOverlay
      )} 
     </div> {/* Fechamento do editPageContainer - Linha 220 */}
    </div> // Fechamento do content_wrapper
  );
}

export default EditarPerfilPage;
