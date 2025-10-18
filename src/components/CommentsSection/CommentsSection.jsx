// src/components/CommentsSection/CommentsSection.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReadingComments } from '../../hooks/useReadingComments';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader/Loader';
import styles from './CommentsSection.module.css';

// --- SUB-COMPONENTE: Formulário de Comentário Dinâmico ---
function CommentForm({ readingId, parentCommentId = null, onCommentPosted = () => {}, isReplyForm = false }) {
  const { user, profile } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isActive, setIsActive] = useState(isReplyForm); // Formulários de resposta já começam ativos

  const { addComment, isAddingComment } = useReadingComments(readingId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    addComment(
      { commentText, userId: user.id, parentCommentId },
      { onSuccess: () => {
          setCommentText('');
          setIsActive(false);
          onCommentPosted();
      }}
    );
  };

  const handleCancel = () => {
    setCommentText('');
    setIsActive(false);
    onCommentPosted(); // Para fechar forms de resposta
  };
  
  if (!user) {
    if (isReplyForm) return null;
    return (
      <p className={styles.loginPrompt}>
        Você precisa <Link to="/login">fazer login</Link> para deixar um comentário.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.commentFormContainer}>
      <div className={styles.commentForm}>
        <img 
          src={profile?.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
          alt="Seu avatar" 
          className={styles.avatar} 
        />
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setIsActive(true)}
          placeholder={parentCommentId ? "Escreva sua resposta..." : "Adicionar um comentário..."}
          className={styles.commentTextarea}
          disabled={isAddingComment}
          rows={isActive ? 3 : 1} // Expande ao focar
        />
      </div>
      {isActive && (
        <div className={styles.commentFormActions}>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isAddingComment || !commentText.trim()}
          >
            {isAddingComment ? 'Enviando...' : (isReplyForm ? 'Responder' : 'Comentar')}
          </button>
        </div>
      )}
    </form>
  );
}


// --- SUB-COMPONENTE: Item de Comentário --- (com pequenas alterações)
function CommentItem({ comment, readingId, isReply = false, deleteComment, isDeletingComment, currentUserId }) {
  const [isReplying, setIsReplying] = useState(false);
  
  const profile = comment.profiles;
  const avatarUrl = profile?.avatar_url || 'https://i.imgur.com/6VBx3io.png';
  const username = profile?.username || 'Anônimo';
  const isOwner = currentUserId === comment.user_id;

  const handleDelete = () => {
    if (isOwner && window.confirm("Tem certeza que quer apagar este comentário?")) {
      deleteComment({ commentId: comment.id, userId: currentUserId });
    }
  };

  return (
    <div className={`${styles.commentItem} ${isReply ? styles.replyItem : ''}`}>
      <img src={avatarUrl} alt={`Avatar de ${username}`} className={styles.avatar} />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <Link to={`/perfil/${username}`} className={styles.username}>@{username}</Link>
          <span className={styles.date}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
        </div>
        <p className={styles.commentBody}>{comment.comment_text}</p>
        <div className={styles.commentActions}>
          {!isReply && currentUserId && (
            <button onClick={() => setIsReplying(!isReplying)} className={styles.replyButton} disabled={isDeletingComment}>
              {isReplying ? 'Cancelar' : 'Responder'}
            </button>
          )}
          {isOwner && (
            <button onClick={handleDelete} className={styles.deleteButton} disabled={isDeletingComment}>
              {isDeletingComment ? 'Apagando...' : 'Apagar'}
            </button>
          )}
        </div>
        {isReplying && (
          <CommentForm
            readingId={readingId}
            parentCommentId={comment.id}
            onCommentPosted={() => setIsReplying(false)}
            isReplyForm={true}
          />
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesContainer}>
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} readingId={readingId} isReply={true} deleteComment={deleteComment} isDeletingComment={isDeletingComment} currentUserId={currentUserId}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL --- (com a nova estrutura)
function CommentsSection({ readingId }) {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState({ column: 'created_at', ascending: false }); // Padrão: Mais Recentes
  
  const {
    commentsPages, totalCommentsCount, isLoadingComments, deleteComment, isDeletingComment,
    fetchNextPage, hasNextPage, isFetchingNextPage
  } = useReadingComments(readingId, sortBy);

  return (
    <div className={styles.commentsWrapper}>
      <div className={styles.mainHeader}>
        <h3 className={styles.title}>
          Comentários ({isLoadingComments ? '...' : totalCommentsCount})
        </h3>
        <div className={styles.sortControls}>
          <button 
            onClick={() => setSortBy({ column: 'created_at', ascending: false })}
            className={`${styles.sortButton} ${sortBy.ascending === false ? styles.active : ''}`}
          >
            Mais Recentes
          </button>
          {/* Adicionar ordenação por "populares" no futuro aqui */}
        </div>
      </div>

      <CommentForm readingId={readingId} />

      {isLoadingComments && <Loader customText="Carregando comentários..." />}

      {!isLoadingComments && totalCommentsCount === 0 && (
        <p className={styles.noComments}>Ainda não há comentários. Seja o primeiro a dizer algo!</p>
      )}

      <div className={styles.commentsList}>
        {commentsPages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                readingId={readingId}
                deleteComment={deleteComment}
                isDeletingComment={isDeletingComment}
                currentUserId={user?.id}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais Comentários'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentsSection;