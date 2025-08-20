// src/app/raffle/page.tsx
'use client';
import React, { useState } from 'react';
import useGetPools from '@/api/useGetPools'; // Import the correct, production-ready hook
import RaffleCard from '@/views/raffle/RaffleCard';
import RetroPanel from '@/components/customized/RetroPanel';
import { RetroButton } from '@/components/RetroButton';
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton';
import { PoolType } from '@/types/raffle';

const RafflesPage = () => {
  const { data: pools, isLoading: loading } = useGetPools(); // Use the correct hook
  const [activeTab, setActiveTab] = useState('INPROCESS'); // Match the status values from PoolType

  // Filter based on the status property from PoolType
  const filteredRaffles = pools?.filter((pool: PoolType) => pool.status === activeTab) || [];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <RaffleCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (filteredRaffles.length === 0) {
      return (
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">No raffles found!</p>
          <p>There are currently no {activeTab === 'INPROCESS' ? 'active' : 'completed'} raffles. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRaffles.map((raffle: PoolType) => (
          <RaffleCard raffle={raffle} key={raffle.id} />
        ))}
      </div>
    );
  };

  return (
    <RetroPanel title="Raffles" className='bg-green-700 max-w-[100%] w-[100%]'>
      <div className="p-4">
        <div className="flex justify-center mb-8 gap-4">
          <RetroButton
            onClick={() => setActiveTab('INPROCESS')}
            className={activeTab === 'INPROCESS' ? 'bg-retro-blue text-white' : ''}
          >
            In Progress
          </RetroButton>
          <RetroButton
            onClick={() => setActiveTab('COMPLETED')}
            className={activeTab === 'COMPLETED' ? 'bg-retro-blue text-white' : ''}
          >
            Completed
          </RetroButton>
        </div>
        {renderContent()}
      </div>
    </RetroPanel>
  );
};

export default RafflesPage;
