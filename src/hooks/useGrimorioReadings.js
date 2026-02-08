import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const READINGS_PER_PAGE = 10;

export function useGrimorioReadings({
  userId,
  searchTerm,
  spreadType,
  periodStart,
  periodEnd,
  privacy,
  withComments,
  withStars,
  cardFilter,
}) {
  const queryKey = [
    'grimorioReadings',
    {
      userId,
      searchTerm,
      spreadType,
      periodStart,
      periodEnd,
      privacy,
      withComments,
      withStars,
      cardFilter,
    },
  ];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return { data: [], count: 0 };

      const from = pageParam * READINGS_PER_PAGE;
      const to = from + READINGS_PER_PAGE - 1;

      let request = supabase
        .from('readings')
        .select(
          `
            id,
            created_at,
            question,
            shared_title,
            spread_type,
            is_public,
            cards_data,
            main_interpretation,
            stars ( count ),
            comments ( count )
          `,
          { count: 'exact' },
        )
        .eq('user_id', userId);

      if (searchTerm) {
        const safeTerm = searchTerm.replace(/%/g, '').trim();
        if (safeTerm) {
          request = request.or(
            `question.ilike.%${safeTerm}%,shared_title.ilike.%${safeTerm}%,main_interpretation.ilike.%${safeTerm}%,cards_data::text.ilike.%${safeTerm}%`,
          );
        }
      }

      if (spreadType) {
        request = request.eq('spread_type', spreadType);
      }

      if (privacy === 'public') {
        request = request.eq('is_public', true);
      }

      if (privacy === 'private') {
        request = request.eq('is_public', false);
      }

      if (periodStart) {
        request = request.gte('created_at', periodStart);
      }

      if (periodEnd) {
        request = request.lte('created_at', periodEnd);
      }

      if (withComments) {
        request = request.gt('comments.count', 0);
      }

      if (withStars) {
        request = request.gt('stars.count', 0);
      }

      if (cardFilter) {
        request = request.contains('cards_data', [{ nome: cardFilter }]);
      }

      request = request.order('created_at', { ascending: false }).range(from, to);

      const { data, error, count } = await request;

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap((page) => page.data).length;
      if (lastPage.count && loadedCount < lastPage.count) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });

  return {
    ...query,
    queryKey,
    readings: query.data?.pages.flatMap((page) => page.data) || [],
    totalCount: query.data?.pages?.[0]?.count || 0,
  };
}
