// src/views/raffle/WinnerInfo.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';
import { PoolType } from '@/types/raffle'; // Import the type
import RetroFrame from '@/components/ui/RetroFrame';
import { formatEthereumAddress } from '@/utils/string';

const WinnerInfo = ({ raffle }: { raffle: PoolType }) => {
  const isWinnerDeclared = raffle.winner && raffle.winner !== '0x0000000000000000000000000000000000000000';

  return (
    <Window title="🏆 WINNER 🏆" className='h-fit'>
      <div className="p-4 text-center">
        <RetroFrame title="WINNER">
        <p className="text-lg text-retro-gray-2 font-bold mb-4">✰⋆♰｡:･ﾟ:‹𝟹 𓆩 <span className='text-retro-black'>Winner's Address</span> 𓆪 ⚝✩°｡⋆⸜(˙꒳˙)</p>
          {isWinnerDeclared ? (
            <p className="text-2xl font-pixel-operator-mono-bold text-retro-blue break-all">{formatEthereumAddress(raffle.winner)}</p>
          ) : (
            <p className="text-xl font-pixel-operator-mono-bold text-retro-gray">To be determined...</p>
          )}
        </RetroFrame>
      </div>
    </Window>
  );
};

export default WinnerInfo;