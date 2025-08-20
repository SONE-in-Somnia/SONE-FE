// src/components/raffle/RaffleUserDeposit.tsx
import React from 'react';

type RaffleUserDepositProps = {
  userTotalDeposit: string;
  symbol: string;
};

const RaffleUserDeposit: React.FC<RaffleUserDepositProps> = ({ userTotalDeposit, symbol }) => (
  <div className="flex items-center justify-between bg-retro-gray-3 text-retro-black px-2 py-1 border border-retro-gray-4 text-center">
    <p className="text-xs font-medium">Your Deposit: {parseFloat(userTotalDeposit).toLocaleString()} {symbol}</p>
  </div>
);

export default RaffleUserDeposit;
