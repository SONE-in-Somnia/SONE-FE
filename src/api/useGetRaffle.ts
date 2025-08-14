// src/api/useGetRaffle.ts
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { getRaffleByIdFromSubgraph } from './subgraph';
import { Raffle } from '@/types/raffle';

export const useGetRaffle = (id: string) => {
  const [raffleData, setRaffleData] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const { registerSocketListener, unRegisterSocketListener } = useSocket();

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const initialRaffle = await getRaffleByIdFromSubgraph(id);
        setRaffleData(initialRaffle);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffle();

    const handleRaffleUpdate = (updatedRaffle: Raffle) => {
      if (updatedRaffle.id.toString() === id) {
        setRaffleData(updatedRaffle);
      }
    };

    registerSocketListener('raffle-updated', handleRaffleUpdate);

    return () => {
      unRegisterSocketListener('raffle-updated', handleRaffleUpdate);
    };
  }, [id, registerSocketListener, unRegisterSocketListener]);

  return { raffleData, loading };
};
