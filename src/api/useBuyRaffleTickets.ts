// src/api/useBuyRaffleTickets.ts
import { useState } from 'react';
import { buyRaffleTickets as apiBuyRaffleTickets } from './raffle';
import { useAppKit } from '@reown/appkit/react';
import { toast } from 'react-toastify';

export const useBuyRaffleTickets = () => {
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useAppKit();

  const buyTickets = async (raffleId: number, ticketCount: number) => {
    const toastId = toast.loading("Please confirm the transaction in your wallet...");
    setIsBuying(true);
    setError(null);
    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      const result = await apiBuyRaffleTickets(raffleId, ticketCount, signer);
      if (result.success) {
        toast.update(toastId, { render: "Transaction confirmed!", type: "success", isLoading: false, autoClose: 5000 });
      } else {
        throw new Error('Transaction failed');
      }
      return result;
    } catch (e: any) {
      setError(e.message);
      toast.update(toastId, { render: e.message || "Transaction failed!", type: "error", isLoading: false, autoClose: 5000 });
      return { success: false };
    } finally {
      setIsBuying(false);
    }
  };

  return { buyTickets, isBuying, error };
};
