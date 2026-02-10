import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { oraclesApi } from '../../services/api/oraclesApi';
import { insertUnifiedReading } from '../../services/supabase/oraclesRepo';

export function useUnifiedReading() {
  const { user } = useAuth();
  const userId = user?.id;

  const createUnifiedReading = useMutation({
    mutationFn: async ({ inputPayload }) => {
      const response = await oraclesApi.createUnifiedReading(inputPayload);

      return insertUnifiedReading({
        userId,
        weekRef: inputPayload?.weekRef,
        inputPayload,
        moduleOutputs: response?.module_outputs || response?.moduleOutputs,
        warnings: response?.warnings || [],
        finalReading: response?.final_reading || response?.finalReading || response,
      });
    },
  });

  return {
    createUnifiedReading: createUnifiedReading.mutateAsync,
    isCreatingUnifiedReading: createUnifiedReading.isPending,
    errorCreatingUnifiedReading: createUnifiedReading.error,
  };
}
