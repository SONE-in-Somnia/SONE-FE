// src/app/raffle/page.tsx
'use client';
import { useGetPoolsRPC } from '@/api/useGetPoolsRPC';
import React, { useState, useMemo } from 'react'; // Added useMemo
import RaffleCard from '@/views/raffle/RaffleCard';
import RetroPanel from '@/components/customized/RetroPanel';
import { RetroButton } from '@/components/RetroButton';
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton';
import { PrizePool, RaffleStatus } from '@/types/raffle'; // Changed PoolType to PrizePool

const RafflesPage = () => {
  const { data: pools, isLoading, error } = useGetPoolsRPC(); // Removed isError

  // --- DEBUG: Log the data from the hook ---
  console.log('--- RafflesPage Debug ---');
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('Raw pools data from useGetPoolsRPC:', pools);

  const [activeTab, setActiveTab] = useState<RaffleStatus>(RaffleStatus.IN_PROGRESS);

  const filteredRaffles = useMemo(() => { // Use useMemo for performance
    if (!pools) return [];

    const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

    return pools.filter((pool: PrizePool) => {
      const isInProgress = currentTime < pool.depositionDeadline;
      const isCompleted = currentTime >= pool.withdrawalTime; // Assuming withdrawalTime marks completion

      if (activeTab === RaffleStatus.IN_PROGRESS) {
        return isInProgress;
      } else { // RaffleStatus.COMPLETED
        return isCompleted;
      }
    });
  }, [pools, activeTab]);


  // --- DEBUG: Log the filtered data ---
  console.log('Active Tab:', activeTab);
  console.log('Filtered Raffles:', filteredRaffles);
  console.log('--------------------------');


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <RaffleCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    // Add error handling for the case where `error` is not null
    if (error) {
      return (
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">Error loading raffles!</p>
          <p>{error}</p>
        </div>
      );
    }

    if (filteredRaffles.length === 0) {
      return (
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">No raffles found!</p>
          <p>There are currently no {activeTab === RaffleStatus.IN_PROGRESS ? 'active' : 'completed'} raffles. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRaffles.map((pool: PrizePool) => (
          <RaffleCard raffle={pool} key={pool.prizePoolAddress} />
        ))}
      </div>
    );
  };

  return (
    <RetroPanel title="Raffles" className='bg-green-700 max-w-[100%] w-[100%]'>
      <div className="p-4">
        <div className="flex justify-center mb-8 gap-4">
          <RetroButton
            onClick={() => setActiveTab(RaffleStatus.IN_PROGRESS)}
            className={activeTab === RaffleStatus.IN_PROGRESS ? 'bg-retro-blue text-white' : ''}
          >
            In Progress
          </RetroButton>
          <RetroButton
            onClick={() => setActiveTab(RaffleStatus.COMPLETED)}
            className={activeTab === RaffleStatus.COMPLETED ? 'bg-retro-blue text-white' : ''}
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