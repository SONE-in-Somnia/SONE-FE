// src/components/raffle/RaffleCardPrizeInfo.tsx
import React from 'react';

const RaffleCardPrizeInfo = ({ totalInterests, symbol, isLoadingWinChance, formattedWinChance }: { totalInterests?: string, symbol?: string, isLoadingWinChance?: boolean, formattedWinChance?: string }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="text-center bg-retro-gray-2 border-2 border-retro-gray-3 p-4">
      <p className="text-sm font-bold">Total Prize</p>
      <p className="text-xl font-pixel-operator-mono-bold text-retro-blue">{totalInterests !== undefined ? totalInterests.toLocaleString() : '0'} {symbol || ''}</p>
    </div>
    <div className="text-center bg-retro-gray border-2 border-t-black border-l-black border-b-white border-r-white p-4">
      <p className="text-sm font-bold">Win Chance</p>
      <p className="text-xl font-pixel-operator-mono-bold text-retro-gray-2">
        {isLoadingWinChance ? '...' : (formattedWinChance || 'N/A')}
      </p>
    </div>
  </div>
);

export default RaffleCardPrizeInfo;
