// src/components/ReadingInteractionBar/ReadingInteraction-Bar.jsx

import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useReadingStars } from '../../hooks/useReadingStars';
import { supabase } from '../../supabaseClient';
import Modal from '../common/Modal/Modal';

import modalStyles from '../common/Modal/Modal.module.css';
import styles from './ReadingInteractionBar.module.css';

function ReadingInteractionBar({ reading, user, isOwner }) {
  const queryClient = useQueryClient();
  const readingId = reading.id;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTitleInput, setShareTitleInput] = useState(reading.shared_title || '');
  const [shareError, setShareError] = useState('');

  const {
    totalStars,
    userHasStarred,
    isLoadingStars,
    addStar,
    removeStar,
    isAddingStar,
    isRemovingStar
  } = useReadingStars(readingId, user?.id);

  const isStarLoading = isAddingStar || isRemovingStar;

  const updateReadingMutation = useMutation({
    mutationFn: async ({ updates }) => {
      if (!user) throw new Error("Usuário não autenticado.");
      
      const { data, error } = await supabase
        .from('readings')
        .update(updates)
        .eq('id', readingId)
        .eq('user_id', user.id)
        .select('is_public, shared_title')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['readings', 'detail', readingId], (oldData) =>
        oldData ? { ...oldData, ...variables.updates } : oldData
      );
      queryClient.invalidateQueries({ queryKey: ['publicReadings'] });
      
      setIsShareModalOpen(false);
      setShareTitleInput(variables.updates.shared_title || '');
    },
    onError: (error) => {
      console.error("Erro ao atualizar leitura:", error);
      setShareError(`Erro: ${error.message}`);
    }
  });

  const handleTogglePublic = () => {
    if (!isOwner) return;
    const currentlyPublic = reading.is_public;
    if (currentlyPublic) {
      if (window.confirm('Tem certeza que deseja tornar esta leitura privada? Ela não será mais visível na comunidade e o título compartilhado será removido.')) {
        updateReadingMutation.mutate({
          updates: { is_public: false, shared_title: null }
        });
      }
    } else {
      setShareTitleInput(reading.shared_title || '');
      setShareError('');
      setIsShareModalOpen(true);
    }
  };

  const handleConfirmShare = (e) => {
    e.preventDefault();
    if (!shareTitleInput.trim()) {
      setShareError("Por favor, adicione um título ou breve descrição.");
      return;
    }
    setShareError('');
    updateReadingMutation.mutate({
      updates: { is_public: true, shared_title: shareTitleInput.trim() }
    });
  };

  return (
    <>
      <div className={styles.wrapper}>
        
        {/* --- LADO ESQUERDO: Ações e Info da Comunidade --- */}
        <div className={styles.leftActions}>
          
          {/* Botão de Estrela (só para não-donos logados) */}
          {!isOwner && user && (
            <button
              onClick={() => userHasStarred ? removeStar() : addStar()}
              disabled={isLoadingStars || isStarLoading}
              className={`${styles.starButton} ${userHasStarred ? styles.starred : ''}`}
              title={userHasStarred ? "Remover estrela" : "Dar estrela"}
            >
              ⭐
              <span>
                {isStarLoading 
                  ? '...' 
                  : (userHasStarred ? 'Estrelado' : 'Dar Estrela')}
              </span>
            </button>
          )}

          {/* Contagem de Estrelas (Sempre visível para todos) */}
          <span className={styles.totalStarsCount}>
              {isLoadingStars ? '...' : `${totalStars} ⭐`}
          </span>
        </div>

        
        {/* --- LADO DIREITO: Status e Ações do Dono --- */}
        <div className={styles.rightActions}>
          

          {/* Botão de Gestão de Partilha (SÓ para o Dono) */}
          {isOwner && (
            <>
              <span className={styles.shareStatus}>
                {reading.is_public ? 'Pública 🌍' : 'Privada 🔒'}
              </span>
              <button
                onClick={handleTogglePublic}
                className={styles.shareButton}
                disabled={updateReadingMutation.isPending}
              >
                {updateReadingMutation.isPending ? 'Salvando...' : (reading.is_public ? 'Tornar Privada' : 'Compartilhar')}
              </button>
            </>
          )}

        </div>
      </div>

      {/* O Modal continua a fazer parte deste componente, renderizado fora do fluxo principal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => !updateReadingMutation.isPending && setIsShareModalOpen(false)}
        title="Compartilhar Leitura"
      >
        <form onSubmit={handleConfirmShare}>
          <p>Adicione um título ou breve descrição para compartilhar sua leitura com a comunidade:</p>
          <textarea
            value={shareTitleInput}
            onChange={(e) => setShareTitleInput(e.target.value)}
            placeholder="Ex: Reflexão sobre minha carreira, Conselho que recebi hoje..."
            rows="4"
            maxLength={200}
            required
            disabled={updateReadingMutation.isPending}
            className={modalStyles.textarea}
          />
          {shareError && <p className={modalStyles.error}>{shareError}</p>}
          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.cancelButton}
              onClick={() => setIsShareModalOpen(false)}
              disabled={updateReadingMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={modalStyles.confirmButton}
              disabled={updateReadingMutation.isPending}
            >
              {updateReadingMutation.isPending ? 'Compartilhando...' : 'Confirmar e Compartilhar'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ReadingInteractionBar;