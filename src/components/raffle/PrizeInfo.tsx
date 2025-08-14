// src/components/raffle/PrizeInfo.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const PrizeInfo = ({ prize }: { prize: string }) => {
  return (
    <Window title="🏆 PRIZE 🏆" className='h-fit'>
      <div className="p-4 text-center">
        <p className="text-lg font-bold">The winner of this raffle will receive:</p>
        <p className="text-4xl font-pixel-operator-mono-bold text-retro-green mt-2">{prize}</p>
      </div>
    </Window>
  );
};

export default PrizeInfo;