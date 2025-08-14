// src/components/raffle/PrizeInfo.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const PrizeInfo = ({ winnerAddress }: { winnerAddress: string }) => {
  return (
    <Window title="🏆 WINNER 🏆" className='h-fit'>
      <div className="p-4 text-center">
        <p className="text-lg font-bold">Winner's Address:</p>
        {/* <p className="text-2xl font-pixel-operator-mono-bold text-retro-yellow mt-2 break-all">{winnerAddress}</p> */}
        <p className="text-2xl font-pixel-operator-mono-bold text-retro-yellow mt-2 break-all">0x..51a2x</p>

      </div>
    </Window>
  );
};

export default PrizeInfo;
