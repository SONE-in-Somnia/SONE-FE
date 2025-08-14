// src/skeleton/PrizeInfoSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const PrizeInfoSkeleton = () => {
  return (
    <Window title="Loading...">
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-retro-gray-2 rounded mb-2 w-1/2"></div>
        <div className="h-12 bg-retro-gray-2 rounded"></div>
      </div>
    </Window>
  );
};

export default PrizeInfoSkeleton;
