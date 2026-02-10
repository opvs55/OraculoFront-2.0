import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { createUnifiedReading as createUnifiedReadingAction } from '../../services/oracleActionsService';

export function useUnifiedReading() {
  const { user } = useAuth();
  const userId = user?.id;

  const createUnifiedReading = useMutation({
    mutationFn: async ({ inputPayload }) => {
      return createUnifiedReadingAction({ ...inputPayload, userId });
    },
  });

  return {
    createUnifiedReading: createUnifiedReading.mutateAsync,
    isCreatingUnifiedReading: createUnifiedReading.isPending,
    errorCreatingUnifiedReading: createUnifiedReading.error,
  };
}
