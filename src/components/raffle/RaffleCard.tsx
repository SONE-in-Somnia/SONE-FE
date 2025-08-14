// src/components/raffle/RaffleCard.tsx
'use client';
import React from 'react';
import Countdown from 'react-countdown';
import { useRouter } from 'next/navigation';
import Window from '@/views/home-v2/components/Window';
import { RetroButton } from '@/components/RetroButton';
import { useGetWinChance } from '@/api/useGetWinChance';

const RaffleCard = ({ raffle, showParticipateButton = true, showExtraInfo = false }: { raffle: any, showParticipateButton?: boolean, showExtraInfo?: boolean }) => {
  const router = useRouter();
  const { formattedWinChance, isLoadingWinChance } = useGetWinChance();

  const handleParticipateClick = () => {
    router.push(`/raffle/${raffle.id}`);
  };

  return (
    <Window title="🎟️ CURRENT RAFFLE 🎟️" className='h-fit'>
      <div className="p-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4 text-center font-pixel-operator-mono">{raffle.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
          <div>
            <p className="text-sm font-bold">Time Remaining</p>
            <Countdown 
              date={raffle.endsAt} 
              className="text-xl font-pixel-operator-mono-bold" 
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return <span>Raffle Ended</span>;
                }
                return <span>{days}d {hours}h {minutes}m {seconds}s</span>
              }}
            />
          </div>
          <div>
            <p className="text-sm font-bold">Participants</p>
            <p className="text-xl font-pixel-operator-mono-bold">{raffle.ticketsSold.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-center bg-retro-gray-2 border-2 border-retro-gray-3 p-4 mb-6">
          <p className="text-sm font-bold">Total Value Locked</p>
          <p className="text-3xl font-pixel-operator-mono-bold text-retro-purple">{raffle.prizePool.toLocaleString()} STT</p>
        </div>

        {showExtraInfo && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center bg-retro-gray-2 border-2 border-retro-gray-3 p-4">
              <p className="text-sm font-bold">Total Prize</p>
              <p className="text-3xl font-pixel-operator-mono-bold text-retro-blue">{raffle.prizePool.toLocaleString()} STT</p>
            </div>
            <div className="text-center bg-retro-gray-2 border-2 border-retro-gray-3 p-4">
              <p className="text-sm font-bold">Win Chance</p>
              <p className="text-3xl font-pixel-operator-mono-bold text-retro-gray">
                {isLoadingWinChance ? '...' : formattedWinChance}
              </p>
            </div>
          </div>
        )}

        {showParticipateButton && (
          <div className="mt-auto">
            <RetroButton 
              onClick={handleParticipateClick} 
              className="w-full"
              disabled={raffle.status === 'completed'}
            >
              {raffle.status === 'completed' ? 'View Results' : 'Participate'}
            </RetroButton>
          </div>
        )}
      </div>
    </Window>
  );
};

export default RaffleCard;
