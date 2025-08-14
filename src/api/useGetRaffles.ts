

// src/api/useGetRaffles.ts
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { getRafflesFromSubgraph } from './subgraph';
import { Raffle } from '@/types/raffle';

export const useGetRaffles = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const { registerSocketListener, unRegisterSocketListener } = useSocket();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const initialRaffles = await getRafflesFromSubgraph();
        setRaffles(initialRaffles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();

    const handleRafflesUpdate = (updatedRaffles: Raffle[]) => {
      setRaffles(updatedRaffles);
    };

    registerSocketListener('raffles-updated', handleRafflesUpdate);

    return () => {
      unRegisterSocketListener('raffles-updated', handleRafflesUpdate);
    };
  }, [registerSocketListener, unRegisterSocketListener]);

  return { raffles, loading };
};
