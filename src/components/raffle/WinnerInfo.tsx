// src/components/raffle/WinnerInfo.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';
import { PoolType } from '@/data/types/pool.type'; // Import the type

const WinnerInfo = ({ raffle }: { raffle: PoolType }) => {
  const isWinnerDeclared = raffle.winner && raffle.winner !== '0x0000000000000000000000000000000000000000';

  return (
    <Window title="🏆 WINNER 🏆" className='h-fit'>
      <div className="p-4 text-center">
        <p className="text-lg font-bold">Winner's Address:</p>
        {isWinnerDeclared ? (
          <p className="text-2xl font-pixel-operator-mono-bold text-retro-yellow mt-2 break-all">{raffle.winner}</p>
        ) : (
          <p className="text-xl font-pixel-operator-mono-bold text-retro-gray mt-2">To be determined...</p>
        )}
      </div>
    </Window>
  );
};

export default WinnerInfo;
