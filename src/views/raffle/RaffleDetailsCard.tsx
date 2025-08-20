// src/views/raffle/RaffleDetailsCard.tsx
'use client';

import React from 'react';
import { RaffleDetailsType } from '@/types/raffle';
import RaffleCardHeader from '@/components/raffle/RaffleCardHeader';
import RaffleCardStats from '@/components/raffle/RaffleCardStats';
import RaffleCardTVL from '@/components/raffle/RaffleCardTVL';
import RaffleCardPrizeInfo from '@/components/raffle/RaffleCardPrizeInfo';
import Window from '@/views/home-v2/components/Window';

type RaffleDetailsCardProps = {
  raffle: RaffleDetailsType;
};

const RaffleDetailsCard: React.FC<RaffleDetailsCardProps> = ({ raffle }) => {
  const totalDeposits = parseFloat(raffle.totalDeposits);
  const userTotalDeposit = parseFloat(raffle.userTotalDeposit);
  const totalPrize = parseFloat(raffle.totalPrize);
  const isCompleted = raffle.status === 'COMPLETED';

  // --- Win Chance Calculation ---
  let formattedWinChance = "N/A"; // Default to N/A

  // Only calculate the percentage if the user has made a deposit
  if (userTotalDeposit > 0 && totalDeposits > 0) {
    const calculatedChance = (userTotalDeposit / totalDeposits) * 100;
    const winChance = Math.min(calculatedChance, 100);
    formattedWinChance = `${winChance.toFixed(0)}%`; // Format for display
  }


  return (
    <Window title="🎟️ RAFFLE DETAILS 🎟️" className="h-fit">
      <div className="p-4 flex flex-col h-full">
        <RaffleCardHeader name={raffle.name} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <RaffleCardStats
            isCompleted={isCompleted}
            drawTime={raffle.drawTime}
            participantCount={raffle.participantCount}
            startTime={raffle.startTime}
          />
          <RaffleCardTVL totalDeposits={totalDeposits} symbol={raffle.symbol} />
        </div>
        <div className="mt-6">
          <RaffleCardPrizeInfo
            totalDeposits={totalPrize}
            symbol={raffle.symbol}
            isLoadingWinChance={false} // False because we calculate it instantly from existing data
            formattedWinChance={formattedWinChance} // Pass the calculated and formatted value
          />
        </div>
      </div>
    </Window>
  );
};

export default RaffleDetailsCard;
