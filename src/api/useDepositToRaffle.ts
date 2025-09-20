// src/api/useDepositToRaffle.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useProcessDeposit } from './useDeposit'; // We can reuse the core mutation function

export const useDepositToRaffle = (raffleId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync: processDeposit } = useProcessDeposit();

  return useMutation({
    mutationFn: processDeposit,
    onSuccess: () => {
      toast.success("Raffle deposit recorded successfully!");
      
      // Invalidate only the queries related to this specific raffle
      queryClient.invalidateQueries({ queryKey: ['raffleDetails', raffleId] });
      queryClient.invalidateQueries({ queryKey: ['raffleHistory', raffleId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to record raffle deposit: ${error.message}`);
    },
  });
};