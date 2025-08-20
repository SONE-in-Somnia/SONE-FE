// src/api/wheely-wheely/useDepositToWheelyWheely.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useProcessDeposit } from '../useDeposit'; // We reuse the core mutation function

export const useDepositToWheelyWheely = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: processDeposit } = useProcessDeposit();

  return useMutation({
    mutationFn: processDeposit,
    onSuccess: () => {
      toast.success("Wheely Wheely deposit recorded successfully!");

      // Invalidate only the queries related to the Wheely Wheely game
      queryClient.invalidateQueries({ queryKey: ['wheelyWheelyPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['wheelyWheelyRound'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to record Wheely Wheely deposit: ${error.message}`);
    },
  });
};
