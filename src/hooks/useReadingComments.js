// src/hooks/useReadingComments.js

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const COMMENTS_PER_PAGE = 10; // Define quantos comentários carregar de cada vez

export function useReadingComments(readingId, sortBy = { column: 'created_at', ascending: false }) {
  const queryClient = useQueryClient();
  const queryKey = ['readingComments', readingId, sortBy];

  // 1. QUERY ATUALIZADA para useInfiniteQuery (para "Carregar Mais")
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingComments,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (!readingId) return { data: [], count: 0 };

      const from = pageParam * COMMENTS_PER_PAGE;
      const to = from + COMMENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('comments')
        .select(`
          id, created_at, comment_text, user_id, parent_comment_id,
          profiles ( username, avatar_url ),
          replies:comments (
            id, created_at, comment_text, user_id,
            profiles ( username, avatar_url )
          )
        `, { count: 'exact' }) // 'exact' para saber o total e calcular a paginação
        .eq('reading_id', readingId)
        .is('parent_comment_id', null)
        .not('profiles', 'is', null)
        .order(sortBy.column, { ascending: sortBy.ascending })
        .range(from, to);

      if (error) {
        console.error("Erro ao buscar comentários paginados:", error);
        throw error;
      }

      data.forEach(comment => {
        comment.replies?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      });
      
      return { data: data || [], count };
    },
    // Define como obter a próxima página
    getNextPageParam: (lastPage, allPages) => {
      const loadedComments = allPages.flatMap(page => page.data).length;
      if (lastPage.count && loadedComments < lastPage.count) {
        return allPages.length; // O próximo pageParam será o número da página atual + 1
      }
      return undefined; // Não há mais páginas
    },
    initialPageParam: 0,
    enabled: !!readingId,
  });

  // Extrai o número total de comentários do primeiro carregamento
  const totalCommentsCount = data?.pages[0]?.count ?? 0;

  // 2. MUTATION: Adicionar Comentário (agora invalida a query para recarregar)
  const addCommentMutation = useMutation({
    mutationFn: async ({ commentText, userId, parentCommentId = null }) => {
      // (Lógica da mutação continua a mesma)
      if (!userId || !commentText.trim()) throw new Error('Texto do comentário ou usuário inválido.');
      const newComment = { reading_id: readingId, user_id: userId, comment_text: commentText.trim(), parent_comment_id: parentCommentId };
      const { data, error } = await supabase.from('comments').insert(newComment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalida a query para forçar o recarregamento com o novo comentário
      queryClient.invalidateQueries({ queryKey: ['readingComments', readingId] });
    },
    onError: (error) => {
      console.error("Erro ao adicionar comentário:", error);
    },
  });

  // 3. MUTATION: Apagar Comentário (agora invalida a query)
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId, userId }) => {
       // (Lógica da mutação continua a mesma)
      if (!userId) throw new Error('É preciso estar logado para apagar.');
      const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', userId);
      if (error) throw error;
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingComments', readingId] });
    },
    onError: (error) => {
      console.error("Erro ao apagar comentário:", error);
      alert("Não foi possível apagar o comentário.");
    }
  });

  return {
    commentsPages: data?.pages || [],
    totalCommentsCount,
    isLoadingComments,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}