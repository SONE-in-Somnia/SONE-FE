'use client';
import { useRaffle } from '@/context/RaffleContext';
import React, { useState, useMemo, useEffect, act } from 'react';
import RaffleCard from '@/views/raffle/RaffleCard';
import RetroPanel from '@/components/customized/RetroPanel';
import { RetroButton } from '@/components/RetroButton';
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton';
import { PrizePool, RaffleStatus, PrizePoolData } from '@/types/raffle'; 

const RafflesPage = () => {
  const { raffles, fetchRaffles, isLoadingList, error } = useRaffle();

  useEffect(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  const [activeTab, setActiveTab] = useState<RaffleStatus>(RaffleStatus.IN_PROGRESS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // filter raffles
  const paginatedRaffles = useMemo(() => { 
    // 1. Convert the cache object to an array of raffle data
    const allRaffles = Object.values(raffles).map(cached => cached.data);

    // 2. Filter the list based on the active tab
    const filteredByTab = allRaffles.filter((raffle) => {
      if (activeTab === RaffleStatus.IN_PROGRESS) {
        return raffle.status === RaffleStatus.IN_PROGRESS;
      } else {
        return  raffle.status === RaffleStatus.COMPLETED ||
                raffle.status === RaffleStatus.DRAW_CLOSED ||
                raffle.status === RaffleStatus.DEPOSIT_CLOSED;
      }
    });

  // 3.Map the filtered data, ensuring every object matches the PrizePool shape
    const mappedRaffles = filteredByTab.map(raffle => {
      if ('userDeposit' in raffle) {
        const detailed = raffle as PrizePoolData;
        // Transform it into the PrizePool object that RaffleCard expects
        return {
          name: detailed.name,
          symbol: detailed.symbol,
          prizePoolAddress: detailed.prizePoolAddress,
          tokenAddress: detailed.token,
          yieldProtocolAddress: detailed.yieldProtocolAddress,
          depositionDeadline: detailed.depositDeadline,
          withdrawalTime: detailed.drawTime,
          totalDeposits: detailed.totalDeposits,
          participantCount: detailed.participantCount,
          winner: detailed.winner,
          status: detailed.status,
        };
      }
      // If it's not a PrizePoolData object, it's already a PrizePool. Return it.
      return raffle as PrizePool;
    });

    //4. Apply pagination slicing
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mappedRaffles.slice(startIndex, endIndex);
  }, [raffles, activeTab, currentPage, itemsPerPage]); 

  const totalRaffles = useMemo(() => {
    const allRaffles = Object.values(raffles).map(cached => cached.data);
    const filteredByTab = allRaffles.filter((raffle) => {
      if (activeTab === RaffleStatus.IN_PROGRESS) {
        return raffle.status === RaffleStatus.IN_PROGRESS;
      } else {
        return (
          raffle.status === RaffleStatus.COMPLETED ||
          raffle.status === RaffleStatus.DRAW_CLOSED ||
          raffle.status === RaffleStatus.DEPOSIT_CLOSED
        );    
      }
    });
    return filteredByTab.length;
  }, [raffles, activeTab]);

  const totalPages = Math.ceil(totalRaffles / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const renderContent = () => {
    if (isLoadingList) {
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
          <p>{error.message}</p>
        </div>
      );
    }

    if (totalPages === 0) {
      return (
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">No raffles found!</p>
          <p>There are currently no {activeTab === RaffleStatus.IN_PROGRESS ? 'active' : 'completed'} raffles. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedRaffles.map((pool: PrizePool) => (
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
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-4 mt-8'>
            <RetroButton
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </RetroButton>
            <span className='text-retro-black font-bold'>
              Page {currentPage}/{totalPages}
            </span>
            <RetroButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </RetroButton>
          </div>
        )}
      </div>
    </RetroPanel>
  );
};

export default RafflesPage;