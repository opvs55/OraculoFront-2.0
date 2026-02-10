import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { saveOrGetNatalChart as saveOrGetNatalChartAction } from '../../services/oracleActionsService';

export function useNatalChart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const natalQuery = useQuery({
    queryKey: ['astrology', 'natal-chart', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('natal_charts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const generateNatalChart = useMutation({
    mutationFn: async (payload) => {
      return saveOrGetNatalChartAction(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['astrology', 'natal-chart', userId], data);
    },
  });

  return {
    natalChart: natalQuery.data,
    isLoadingNatalChart: natalQuery.isLoading,
    errorNatalChart: natalQuery.error,
    refetchNatalChart: natalQuery.refetch,
    generateNatalChart: generateNatalChart.mutateAsync,
    isGeneratingNatalChart: generateNatalChart.isPending,
    errorGeneratingNatalChart: generateNatalChart.error,
  };
}
