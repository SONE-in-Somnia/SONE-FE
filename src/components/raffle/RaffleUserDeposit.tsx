// src/components/raffle/RaffleUserDeposit.tsx
import React from 'react';
// import { formatEther } from 'viem'; // Remove this import if not used

type RaffleUserDepositProps = {
  userTotalDeposit: string;
  symbol: string;
};

const RaffleUserDeposit = ({ userTotalDeposit, symbol }: RaffleUserDepositProps) => {
  // userTotalDeposit is already a formatted string, no need to call formatEther
  const formattedDeposit = parseFloat(userTotalDeposit).toLocaleString(); // Just parse and format as number

  return (
    <div className="flex items-center justify-between bg-retro-gray-3 text-retro-black px-2 py-1 border border-retro-gray-4 text-center">
        <p className="text-xs font-medium">Your Deposit: {formattedDeposit} {symbol}</p>
    </div>
  );
 }

export default RaffleUserDeposit;