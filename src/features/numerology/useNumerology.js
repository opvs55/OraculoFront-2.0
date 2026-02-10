import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { oraclesApi } from '../../services/api/oraclesApi';
import { supabase } from '../../supabaseClient';
import { saveOrGetPersonalNumerology, upsertWeeklyNumerology } from '../../services/supabase/oraclesRepo';

function getWeekStart(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export function useNumerology() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const personalQuery = useQuery({
    queryKey: ['numerology', 'personal', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('numerology_readings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const calculatePersonal = useMutation({
    mutationFn: async ({ birthDate }) => {
      const apiData = await oraclesApi.getPersonalNumerology({ birthDate, userId });
      return saveOrGetPersonalNumerology({
        userId,
        payload: {
          input_birth_date: birthDate,
          ...apiData,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['numerology', 'personal', userId], data);
    },
  });

  const calculateWeekly = useMutation({
    mutationFn: async ({ birthDate }) => {
      const weekStart = getWeekStart();
      const apiData = await oraclesApi.getWeeklyNumerology({ birthDate, userId, weekStart });
      return upsertWeeklyNumerology({
        userId,
        weekStart,
        readingData: apiData,
      });
    },
  });

  return {
    personalNumerology: personalQuery.data,
    isLoadingPersonal: personalQuery.isLoading,
    errorPersonal: personalQuery.error,
    refetchPersonal: personalQuery.refetch,
    calculatePersonal: calculatePersonal.mutateAsync,
    isCalculatingPersonal: calculatePersonal.isPending,
    errorCalculatingPersonal: calculatePersonal.error,
    calculateWeekly: calculateWeekly.mutateAsync,
    isCalculatingWeekly: calculateWeekly.isPending,
    errorCalculatingWeekly: calculateWeekly.error,
  };
}
