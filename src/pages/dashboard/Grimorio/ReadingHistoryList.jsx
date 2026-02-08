import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabaseClient';
import { formatRelativeDate } from '../../../utils/formatRelativeDate';
import { getQuestionText } from '../../../utils/getQuestionText';
import styles from '../MeuGrimorioPage.module.css';

const spreadLabels = {
  celticCross: 'Cruz Celta',
  threeCards: '3 Cartas',
  templeOfAphrodite: 'Templo de Afrodite',
  pathChoice: 'Escolha de Caminho',
  oneCard: 'Uma Carta',
};

const getCardImageUrl = (image) =>
  image ? `${import.meta.env.BASE_URL}${image.startsWith('/') ? image.slice(1) : image}` : null;

function ReadingItem({ reading, userId, queryKey }) {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(reading.shared_title || '');

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const { data, error } = await supabase
        .from('readings')
        .update(updates)
        .eq('id', reading.id)
        .eq('user_id', userId)
        .select(
          'id, created_at, question, shared_title, spread_type, is_public, cards_data, main_interpretation',
        )
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
          })),
        };
      });
      setIsEditing(false);
      setIsMenuOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('readings').delete().eq('id', reading.id).eq('user_id', userId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== reading.id),
          })),
        };
      });
    },
  });

  const cardsPreview = Array.isArray(reading.cards_data) ? reading.cards_data.slice(0, 3) : [];
  const title =
    reading.shared_title
    || getQuestionText(reading.question, reading.spread_type)
    || 'Leitura sem título';

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    updateMutation.mutate({ shared_title: trimmed || null });
  };

  const handleTogglePrivacy = () => {
    updateMutation.mutate({
      is_public: !reading.is_public,
      shared_title: !reading.is_public ? (reading.shared_title || title) : null,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta leitura? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate();
    }
  };

  return (
    <article className={styles.historyCard}>
      <div className={styles.historyHeader}>
        <div>
          <p className={styles.historyMeta}>
            {formatRelativeDate(reading.created_at)} · {spreadLabels[reading.spread_type] || reading.spread_type}
          </p>
          {isEditing ? (
            <div className={styles.historyTitleEdit}>
              <input
                type="text"
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                placeholder="Adicionar título rápido"
                className={styles.historyTitleInput}
              />
              <button
                type="button"
                className={styles.historyActionPrimary}
                onClick={handleSaveTitle}
                disabled={updateMutation.isPending}
              >
                Salvar
              </button>
              <button
                type="button"
                className={styles.historyActionGhost}
                onClick={() => {
                  setIsEditing(false);
                  setTitleDraft(reading.shared_title || '');
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <h3 className={styles.historyTitle}>{title}</h3>
          )}
        </div>
        <div className={styles.historyActions}>
          <button
            type="button"
            className={styles.historyMenuButton}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Abrir ações"
          >
            ⋯
          </button>
          {isMenuOpen && (
            <div className={styles.historyMenu}>
              <Link to={`/leitura/${reading.id}`} className={styles.historyMenuItem}>
                Abrir
              </Link>
              <button
                type="button"
                className={styles.historyMenuItem}
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
              >
                Editar título
              </button>
              <button
                type="button"
                className={styles.historyMenuItem}
                onClick={handleTogglePrivacy}
                disabled={updateMutation.isPending}
              >
                {reading.is_public ? 'Tornar privada' : 'Tornar pública'}
              </button>
              <button
                type="button"
                className={styles.historyMenuItemDanger}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.historyContent}>
        <div className={styles.historyCardsPreview}>
          {cardsPreview.length ? (
            cardsPreview.map((card, index) => {
              const imageUrl = getCardImageUrl(card?.img);
              return (
                <div key={`${card?.nome || 'card'}-${index}`} className={styles.historyCardThumb}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={card?.nome || 'Carta'} />
                  ) : (
                    <div className={styles.historyCardThumbPlaceholder} />
                  )}
                </div>
              );
            })
          ) : (
            <>
              <div className={styles.historyCardThumbPlaceholder} />
              <div className={styles.historyCardThumbPlaceholder} />
              <div className={styles.historyCardThumbPlaceholder} />
            </>
          )}
        </div>
        <div className={styles.historyIndicators}>
          <span>{reading.is_public ? 'Pública' : 'Privada'}</span>
          <span>⭐ {reading.stars?.[0]?.count ?? 0}</span>
          <span>💬 {reading.comments?.[0]?.count ?? 0}</span>
        </div>
      </div>
    </article>
  );
}

export default function ReadingHistoryList({
  readings,
  isLoading,
  isError,
  onRetry,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  userId,
  queryKey,
}) {
  if (isLoading) {
    return (
      <div className={styles.historyList}>
        <div className={styles.historySkeleton} />
        <div className={styles.historySkeleton} />
        <div className={styles.historySkeleton} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.historyEmpty}>
        <p>Não foi possível carregar seu grimório.</p>
        <button type="button" className={styles.historyActionPrimary} onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!readings.length) {
    return (
      <div className={styles.historyEmpty}>
        <p>Seu grimório ainda está em silêncio. Faça sua primeira leitura.</p>
        <Link to="/tarot" className={styles.historyActionPrimary}>
          Fazer leitura
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.historyList}>
      {readings.map((reading) => (
        <ReadingItem key={reading.id} reading={reading} userId={userId} queryKey={queryKey} />
      ))}

      {hasNextPage && (
        <button
          type="button"
          className={styles.historyLoadMore}
          onClick={onLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  );
}
