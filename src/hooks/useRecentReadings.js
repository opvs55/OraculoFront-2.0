import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

export function useRecentReadings(userId, limit = 3) {
  return useQuery({
    queryKey: ['readings', 'recent', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('readings')
        .select('id, created_at, question, shared_title, spread_type, is_public')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar leituras recentes:', error);
        throw new Error(`Erro ao buscar leituras recentes: ${error.message}`);
      }
      return data || [];
    },
    enabled: !!userId,
  });
}
