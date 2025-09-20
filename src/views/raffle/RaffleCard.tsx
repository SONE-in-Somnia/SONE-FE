'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Window from '@/views/home-v2/components/Window';
import { PrizePool } from '@/types/raffle';
import RaffleCardHeader from '@/components/raffle/RaffleCardHeader';
import RaffleCardStats from '@/components/raffle/RaffleCardStats';
import RaffleCardTVL from '@/components/raffle/RaffleCardTVL';
import RaffleCardPrizeInfo from '@/components/raffle/RaffleCardPrizeInfo';
import RaffleCardActions from '@/components/raffle/RaffleCardActions';
import { formatEthereumAddress } from '@/utils/string';
import styles from '@/styles/WinnerInfo.module.css';

// Define the component's props
type RaffleCardProps = {
  raffle: PrizePool; 
  // Add optional props for detailed data
  showParticipateButton?: boolean;
  showExtraInfo?: boolean;
};

const RaffleCard = ({
  raffle,
  showParticipateButton = true,
  showExtraInfo = false }: RaffleCardProps) => {
  const router = useRouter();
  
  const isRaffleCompletedByStatus = raffle.status === 'COMPLETED';
  const [isCompleted, setIsCompleted] = useState(isRaffleCompletedByStatus);

  const handleParticipateClick = () => {
    router.push(`/raffle/${raffle.prizePoolAddress}`);
  };

  const drawTime = Number(raffle.withdrawalTime);

  // check COMPLETED
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
    <Window
      title="🎟️ CURRENT RAFFLE 🎟️"
      className='h-fit'
      contentClassName={isCompleted ? "bg-retro-black" : ""}
    >
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <RaffleCardHeader name={raffle.name} isCompleted={isCompleted} />
        
        {/* Conditionally render the winner's address */}
        {isCompleted && (
          <div className="text-center my-4">
            <p className="text-lg text-retro-gray-2 font-bold">Winner's Address</p>
            <p className={`${styles.gifTextEffect} text-xl font-pixel-operator-mono-bold text-retro-gray-2`}>
              {formatEthereumAddress(raffle.winner)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-10">
          <RaffleCardStats 
            isCompleted={isCompleted} 
            drawTime={raffle.withdrawalTime} 
            participantCount={raffle.participantCount}
          />
          <RaffleCardTVL totalDeposits={raffle.totalDeposits} symbol={raffle.symbol} />
        </div>

        {showExtraInfo && (
          <RaffleCardPrizeInfo 
            symbol={raffle.symbol} 
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