// src/skeleton/RaffleDetailsCardSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const RaffleDetailsCardSkeleton = () => (
  <Window title="🎟️ RAFFLE DETAILS 🎟️" className="h-fit">
    <div className="p-4 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-600 rounded w-full"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-600 rounded w-full"></div>
        </div>
      </div>
      {/* Prize Info */}
      <div className="mt-6 space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  </Window>
);

export default RaffleDetailsCardSkeleton;
