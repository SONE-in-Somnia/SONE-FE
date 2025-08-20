// src/views/raffle/RaffleCard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Window from '@/views/home-v2/components/Window';
import { useGetWinChance } from '@/api/useGetWinChance';
import { PoolType } from '@/types/raffle';
import RaffleCardHeader from '@/components/raffle/RaffleCardHeader';
import RaffleCardStats from '@/components/raffle/RaffleCardStats';
import RaffleCardTVL from '@/components/raffle/RaffleCardTVL';
import RaffleCardPrizeInfo from '@/components/raffle/RaffleCardPrizeInfo';
import RaffleCardActions from '@/components/raffle/RaffleCardActions';
import { formatEthereumAddress } from '@/utils/string'; // Import the formatting utility

// Define the component's props
type RaffleCardProps = {
  raffle: PoolType & { totalPrize?: string }; // Allow an optional totalPrize
  showParticipateButton?: boolean;
  showExtraInfo?: boolean;
};

const RaffleCard = ({ raffle, showParticipateButton = true, showExtraInfo = false }: RaffleCardProps) => {
  const router = useRouter();
  const { formattedWinChance, isLoadingWinChance } = useGetWinChance();
  
  const isRaffleCompletedByStatus = raffle.status === 'COMPLETED';
  const [isCompleted, setIsCompleted] = useState(isRaffleCompletedByStatus);

  const handleParticipateClick = () => {
    router.push(`/raffle/${raffle.id}`);
  };

  const totalDeposits = parseFloat(raffle.totalDeposits);
  // Use the explicit totalPrize if available, otherwise fall back to totalDeposits
  const prizeAmount = raffle.totalPrize ? parseFloat(raffle.totalPrize) : totalDeposits;
  const drawTime = Number(raffle.drawTime);

  useEffect(() => {
    if (isRaffleCompletedByStatus) {
      setIsCompleted(true);
      return;
    }

    const checkTime = () => {
      const now = Date.now() / 1000;
      if (now > drawTime) {
        setIsCompleted(true);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, [drawTime, isRaffleCompletedByStatus]);

  return (
    <Window title="🎟️ CURRENT RAFFLE 🎟️" className='h-fit'>
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <RaffleCardHeader name={raffle.name} />
        
        {/* Conditionally render the winner's address */}
        {isCompleted && (
          <div className="text-center my-4">
            <p className="text-lg text-retro-gray-2 font-bold">Winner's Address</p>
            <p className="text-xl font-pixel-operator-mono-bold text-retro-blue break-all">
              {formatEthereumAddress(raffle.winner)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-10">
          <RaffleCardStats 
            isCompleted={isCompleted} 
            drawTime={raffle.drawTime} 
            participantCount={raffle.participantCount} 
            startTime={raffle.startTime} 
          />
          <RaffleCardTVL totalDeposits={totalDeposits} symbol={raffle.symbol} />
        </div>

        {showExtraInfo && (
          <RaffleCardPrizeInfo 
            totalDeposits={prizeAmount} // Use the determined prize amount
            symbol={raffle.symbol} 
            isLoadingWinChance={isLoadingWinChance} 
            formattedWinChance={formattedWinChance} 
          />
        )}

        {showParticipateButton && (
          <RaffleCardActions 
            handleParticipateClick={handleParticipateClick} 
            isCompleted={isCompleted} 
          />
        )}
      </div>
    </Window>
  );
};

export default RaffleCard;