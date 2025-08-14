// src/components/raffle/RaffleHistory.tsx
'use client';
import React from 'react';
import { useGetRaffleHistory } from '@/api/useGetRaffleHistory';
import Window from '@/views/home-v2/components/Window';

const RaffleHistory = () => {
  const { history, loading } = useGetRaffleHistory();

  return (
    <Window title="📜 RAFFLE ACTIVITIES 📜" className='h-fit'>
      <div className="p-4">
        {loading ? (
          <p className="font-bold">Loading history...</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id} className="bg-retro-gray-2 p-2 border-2 border-retro-gray-3">
                <p className="font-bold">Address: <span className="font-pixel-operator-mono">{item.winner}</span></p>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">Deposit: <span className="font-pixel-operator-mono-bold text-retro-purple">{item.prize}</span></span>
                  <span className="font-pixel-operator-mono">{item.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Window>
  );
};

export default RaffleHistory;