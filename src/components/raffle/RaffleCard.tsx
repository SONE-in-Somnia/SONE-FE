// src/components/raffle/RaffleCard.tsx
import React from 'react';
import Countdown from 'react-countdown';
import Window from '@/views/home-v2/components/Window';

const RaffleCard = ({ raffle }: { raffle: any }) => {
  return (
    <Window title="🎟️ CURRENT RAFFLE 🎟️" className='h-fit'>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center font-pixel-operator-mono">{raffle.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
          <div>
            <p className="text-sm font-bold">Time Remaining</p>
            <Countdown 
              date={raffle.endsAt} 
              className="text-xl font-pixel-operator-mono-bold" 
              renderer={({ days, hours, minutes, seconds }) => (
                <span>{days}d {hours}h {minutes}m {seconds}s</span>
              )}
            />
          </div>
          <div>
            <p className="text-sm font-bold">Tickets Sold</p>
            <p className="text-xl font-pixel-operator-mono-bold">{raffle.ticketsSold.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-center bg-retro-gray-2 border-2 border-retro-gray-3 p-4">
          <p className="text-sm font-bold">Current Prize Pool</p>
          <p className="text-3xl font-pixel-operator-mono-bold text-retro-blue">{raffle.prizePool.toLocaleString()} FUKU</p>
        </div>
      </div>
    </Window>
  );
};

export default RaffleCard;