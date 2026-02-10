import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { oraclesApi } from '../../services/api/oraclesApi';
import { supabase } from '../../supabaseClient';
import { saveOrGetNatalChart } from '../../services/supabase/oraclesRepo';

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
      const apiData = await oraclesApi.getNatalChart(payload);

      return saveOrGetNatalChart({
        userId,
        payload: {
          birth_date: payload?.user?.birth_date,
          birth_time: payload?.user?.birth_time,
          birth_city: payload?.user?.birth_city,
          chart_data: apiData,
        },
      });
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
