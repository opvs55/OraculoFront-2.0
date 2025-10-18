import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import styles from './CommentSection.module.css';
import Loader from '../../common/Loader/Loader'; // Reutilizamos o Loader

// Hook para buscar comentários de uma leitura
function useComments(readingId) {
  return useQuery({
    queryKey: ['comments', readingId],
    queryFn: async () => {
      if (!readingId) return [];
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          created_at,
          comment_text,
          user_id,
          profiles ( username, avatar_url ) 
        `) // Busca o comentário e dados do perfil do autor
        .eq('reading_id', readingId)
        .order('created_at', { ascending: true }); // Mais antigos primeiro

      if (error) throw error;
      // Garante que temos um perfil associado (embora RLS deva garantir isso)
      return data.filter(comment => comment.profiles); 
    },
    enabled: !!readingId,
  });
}

function CommentSection({ readingId }) {
  const { user } = useAuth(); // Pega o usuário logado
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // Busca os comentários existentes
  const { data: comments, isLoading, isError, error } = useComments(readingId);

  // Mutação para adicionar um novo comentário
  const addCommentMutation = useMutation({
    mutationFn: async (commentText) => {
      if (!user || !readingId || !commentText.trim()) throw new Error("Dados inválidos para comentar.");

      const { data, error: insertError } = await supabase
        .from('comments')
        .insert({
          reading_id: readingId,
          user_id: user.id,
          comment_text: commentText.trim(),
        })
        .select(`
            id, created_at, comment_text, user_id, 
            profiles ( username, avatar_url ) 
        `) // Retorna o comentário recém-criado com os dados do perfil
        .single(); // Esperamos apenas um resultado

      if (insertError) throw insertError;
      return data; // Retorna o novo comentário formatado
    },
    // Quando um comentário é adicionado com sucesso:
    onSuccess: (newCommentData) => {
      // Atualiza o cache do React Query IMEDIATAMENTE com o novo comentário
      queryClient.setQueryData(['comments', readingId], (oldData) => 
        oldData ? [...oldData, newCommentData] : [newCommentData]
      );
      setNewComment(''); // Limpa a caixa de texto
    },
    onError: (error) => {
      console.error("Erro ao adicionar comentário:", error);
      alert(`Não foi possível adicionar seu comentário: ${error.message}`);
    }
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    addCommentMutation.mutate(newComment);
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.sectionTitle}>Comentários da Comunidade</h3>
      
      {/* Lista de Comentários */}
      <div className={styles.commentList}>
        {isLoading && <Loader customText="Carregando comentários..." small />}
        {isError && <p className={styles.error}>Erro ao carregar comentários: {error.message}</p>}
        {!isLoading && !isError && comments && comments.length === 0 && (
          <p className={styles.noComments}>Ainda não há comentários. Seja o primeiro!</p>
        )}
        {!isLoading && !isError && comments && comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            <img 
              src={comment.profiles?.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
              alt={`Avatar de ${comment.profiles?.username}`}
              className={styles.commentAvatar}
            />
            <div className={styles.commentContent}>
              <span className={styles.commentAuthor}>@{comment.profiles?.username || 'Usuário'}</span>
              <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
              <p className={styles.commentText}>{comment.comment_text}</p>
            </div>
            {/* Adicionar botão de apagar para o dono do comentário aqui no futuro, se desejado */}
          </div>
        ))}
      </div>

      {/* Formulário para Adicionar Comentário (só para usuários logados) */}
      {user && (
        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário ou conselho..."
            rows="3"
            required
            disabled={addCommentMutation.isPending}
          />
          <button type="submit" disabled={addCommentMutation.isPending}>
            {addCommentMutation.isPending ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      )}
      {!user && (
        <p className={styles.loginPrompt}>
          <Link to="/login">Entre</Link> ou <Link to="/cadastro">Cadastre-se</Link> para comentar.
        </p>
      )}
    </div>
  );
}

export default CommentSection;