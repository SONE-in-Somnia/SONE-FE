// src/skeleton/TicketPurchaseSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const TicketPurchaseSkeleton = () => {
  return (
    <Window title="Loading...">
      <div className="p-4 animate-pulse">
        <div className="h-6 bg-retro-gray-2 rounded mb-4 w-3/4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 bg-retro-gray-2 rounded w-28"></div>
          <div className="h-8 bg-retro-gray-2 rounded w-1/2"></div>
        </div>
        <div className="h-12 bg-retro-gray-2 rounded"></div>
      </div>
    </Window>
  );
};

export default TicketPurchaseSkeleton;
