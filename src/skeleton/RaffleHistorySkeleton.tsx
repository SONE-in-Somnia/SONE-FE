// src/skeleton/RaffleHistorySkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const RaffleHistorySkeleton = () => {
  return (
    <Window title="Loading..." className='h-fit'>
      <div className="h-10 p-4 animate-pulse">
        <div className="bg-retro-gray-2 rounded mb-4 w-3/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-retro-gray-2 rounded"></div>
          ))}
        </div>
      </div>
    </Window>
  );
};

export default RaffleHistorySkeleton;
