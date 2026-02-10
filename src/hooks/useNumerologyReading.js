import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNumerology } from '../features/numerology/useNumerology';

export function useNumerologyReading() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const {
    personalNumerology,
    isLoadingPersonal,
    errorPersonal,
    refetchPersonal,
    calculatePersonal,
    isCalculatingPersonal,
    errorCalculatingPersonal,
  } = useNumerology();

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Você precisa estar logado para resetar.');

      const { error } = await supabase.from('numerology_readings').delete().eq('user_id', userId);
      if (error) throw error;

      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(['numerology', 'personal', userId], null);
    },
  });

  return {
    numerologyData: personalNumerology,
    isLoadingReading: isLoadingPersonal,
    errorLoadingReading: errorPersonal,
    refetchReading: refetchPersonal,
    calculateNumerology: ({ birthDate }) => calculatePersonal({ birthDate }),
    isCalculating: isCalculatingPersonal,
    errorCalculating: errorCalculatingPersonal,
    isSuccessCalculating: false,
    resetCalculationState: () => {},
    resetNumerology: () => resetMutation.mutateAsync(),
    isResetting: resetMutation.isPending,
    errorResetting: resetMutation.error,
    isSuccessResetting: resetMutation.isSuccess,
    resetResetState: resetMutation.reset,
  };
}
