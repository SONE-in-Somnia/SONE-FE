// src/skeleton/RaffleCardSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const RaffleCardSkeleton = () => {
  return (
    <Window title="Loading...">
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-retro-gray-2 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-12 bg-retro-gray-2 rounded"></div>
          <div className="h-12 bg-retro-gray-2 rounded"></div>
        </div>
        <div className="h-20 bg-retro-gray-2 rounded"></div>
      </div>
    </Window>
  );
};

export default RaffleCardSkeleton;
