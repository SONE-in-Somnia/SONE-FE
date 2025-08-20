// src/components/raffle/RaffleCardStats.tsx
import React from 'react';
import ProgressBar from '@/components/ui/ProgressBar';

const RaffleCardStats = ({ isCompleted, drawTime, participantCount, startTime }: { isCompleted: boolean, drawTime: string, participantCount: number, startTime: string }) => (
  <div className="mb-6 text-center flex flex-col justify-between ">
    <div className='flex items-center justify-between border-dotted border-b-4 border-white pb-1'>
      <p className="text-sm font-bold">Participants</p>
      <p className="text-md">{participantCount.toLocaleString()}</p>
    </div>
    <div className="mt-4">
      <p className="text-sm font-bold">Time Remaining</p>
      <div className="text-md mt-2 relative">
        <ProgressBar startTime={Number(startTime)} endTime={Number(drawTime)} />
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold z-2">Raffle Ended</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RaffleCardStats;
