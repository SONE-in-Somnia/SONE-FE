// src/components/raffle/RaffleCardStats.tsx
import React from 'react';
import Countdown from '@/components/Countdown';

import { cn } from "@/lib/utils";

const RaffleCardStats = ({ isCompleted, drawTime, participantCount }: { isCompleted: boolean, drawTime: number, participantCount: number }) => (
  <div className={cn("mb-6 text-center flex flex-col justify-between ", isCompleted && "text-white")}>
    <div className='flex items-center justify-between border-dotted border-b-4 border-retro-gray-2 pb-1'>
      <p className="text-sm">Investors</p>
      <p className="text-md font-bold">{participantCount !== undefined ? participantCount.toLocaleString
      () : '-'}</p>
    </div>
    <div className="">
      {!isCompleted && (
        <p className="text-sm">Time Remaining</p>
      )}
      <div className="text-md mt-2 relative">
        {drawTime !== undefined && !isCompleted ? (
          <Countdown endTime={Number(drawTime) * 1000} />
        ) : (
          ''
        )}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold z-2 mb-6 bg-retro-orange">Raffle Ended</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RaffleCardStats;
