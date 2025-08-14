// src/skeleton/RaffleHistorySkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const RaffleHistorySkeleton = () => {
  return (
    <Window title="Loading...">
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-retro-gray-2 rounded mb-4 w-3/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-retro-gray-2 rounded"></div>
          ))}
        </div>
      </div>
    </Window>
  );
};

export default RaffleHistorySkeleton;
