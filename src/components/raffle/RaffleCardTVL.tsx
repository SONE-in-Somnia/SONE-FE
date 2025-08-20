// src/components/raffle/RaffleCardTVL.tsx
import React from 'react';

const RaffleCardTVL = ({ totalDeposits, symbol }: { totalDeposits: number, symbol: string }) => (
  <div className="text-center bg-retro-gray border-2 border-t-black border-l-black border-b-white border-r-white p-4 mb-6">
    <p className="text-sm font-bold">Total Value Locked</p>
    <p className="text-xl font-pixel-operator-mono-bold text-retro-gray-2 mt-3">{totalDeposits.toLocaleString()} {symbol}</p>
  </div>
);

export default RaffleCardTVL;
