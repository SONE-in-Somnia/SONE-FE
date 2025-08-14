// src/api/useDepositForRaffle.ts
import { useState } from 'react';
import { depositForRaffle as apiDepositForRaffle } from './raffle';
import { useAppKit } from '@reown/appkit/react';
import { toast } from 'react-toastify';
import { useProcessDeposit } from './useDeposit';
import { formatUnits } from 'viem';

export const useDepositForRaffle = () => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useAppKit();
  const { mutateAsync: processDeposit } = useProcessDeposit();

  const deposit = async (raffleId: number, depositAmount: bigint) => {
    const toastId = toast.loading("Please confirm the transaction in your wallet...");
    setIsDepositing(true);
    setError(null);
    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      const result = await apiDepositForRaffle(raffleId.toString(), depositAmount, signer);
      
      if (result.success && result.txHash) {
        toast.update(toastId, { render: "Transaction confirmed! Processing...", type: "success", isLoading: true });

        await processDeposit({
          amount: Number(formatUnits(depositAmount, 18)), // Assuming 18 decimals
          txHash: result.txHash,
          token: 'STT',
          poolAddress: raffleId.toString(),
        });

        toast.update(toastId, { render: "Deposit successful!", type: "success", isLoading: false, autoClose: 5000 });
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
      return result;
    } catch (e: any) {
      setError(e.message);
      toast.update(toastId, { render: e.message || "Transaction failed!", type: "error", isLoading: false, autoClose: 5000 });
      return { success: false };
    } finally {
      setIsDepositing(false);
    }
  };

  return { deposit, isDepositing, error };
};
