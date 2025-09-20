// src/skeleton/RaffleDepositSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const RaffleDepositSkeleton = () => (
  <Window title="💰 DEPOSIT 💰">
    <div className="p-4 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-full mb-4"></div>
      <div className="h-12 bg-gray-600 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-700 rounded w-full"></div>
    </div>
  </Window>
);

export default RaffleDepositSkeleton;
