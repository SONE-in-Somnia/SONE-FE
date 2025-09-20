'use client';

import React from 'react';
import { PrizePoolData } from '@/types/raffle';
import RaffleCardHeader from '@/components/raffle/RaffleCardHeader';
import RaffleCardStats from '@/components/raffle/RaffleCardStats';
import RaffleCardTVL from '@/components/raffle/RaffleCardTVL';
import RaffleCardPrizeInfo from '@/components/raffle/RaffleCardPrizeInfo';
import Window from '@/views/home-v2/components/Window';

interface RaffleDetailsCardProps {
  raffle: PrizePoolData; 
}


const RaffleDetailsCard: React.FC<RaffleDetailsCardProps> = ({ raffle }) => {
  // Derive isCompleted from drawTime
  const isCompleted = Date.now() / 1000 >= raffle.drawTime;

  // --- Win Chance Calculation ---
  const formattedWinChance = `${Number(raffle.userWinRate).toFixed(0)}%`; 


  return (
    <Window title="🎟️ RAFFLE DETAILS 🎟️" className="h-fit">
      <div className="p-4 flex flex-col h-full">
        <RaffleCardHeader name={raffle.name} isCompleted={isCompleted} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <RaffleCardStats
            isCompleted={isCompleted}
            drawTime={raffle.drawTime} 
            participantCount={raffle.participantCount}
          />
          <RaffleCardTVL totalDeposits={raffle.totalDeposits} symbol={raffle.symbol} /> {/* Changed symbol to depositToken */}
        </div>
        <div className="mt-6">
          <RaffleCardPrizeInfo
            totalInterests={raffle.totalInterest}
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