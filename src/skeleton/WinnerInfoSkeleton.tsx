// src/skeleton/WinnerInfoSkeleton.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';

const WinnerInfoSkeleton = () => (
  <Window title="🏆 WINNER 🏆">
    <div className="p-4 animate-pulse">
      <div className="bg-gray-700 rounded w-3/4 mx-auto"></div>
    </div>
  </Window>
);

export default WinnerInfoSkeleton;
