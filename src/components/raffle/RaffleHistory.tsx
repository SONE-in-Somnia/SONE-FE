// src/components/raffle/RaffleHistory.tsx
'use client';
import React, { useEffect } from 'react';
import { useGetRaffleHistory } from '@/api/useGetRaffleHistory';
import Window from '@/views/home-v2/components/Window';
import { RecentActivity } from '@/data/types/pool.type'; // Import the type
import { format } from 'date-fns'; // Using date-fns for robust date formatting
import useGetPoolActivities from '@/api/useGetPoolActivities';
import { RetroButton } from '../RetroButton';

const RaffleHistory = ({ poolId }: { poolId: string }) => {
  // Destructure isError and  error from the hook
  const { mutate: getActivities, data: history, isPending: loading, isError, error } = useGetPoolActivities();
  useEffect(() => {
    if (poolId) {
      // Fetch initial 10 activities
      getActivities({ poolId: poolId, type: 'DEPOSIT', limit: 10, skip: 0 });
    }
  }, [poolId, getActivities]);

  const handleLoadMore = () => {
    if (poolId && history) {
      getActivities({
        poolId: poolId,
        type: 'DEPOSIT',
        limit: 10,
        skip: history.length, // Skip the one that already load
      });
    }
  };

  const renderContent = () => {
    if (loading && !history) { // Show loading skeleton only on initial load
      return <p className='font-bold'>Loading activities...</p>;
    }

    if (isError) {
      return <p className='text-retro-red'>Error loading activities: {error?.message || "Unknown Error"}</p>;
    }

    if (!history || history.length === 0) {
      return <p className='font-bold'>No activities yet.</p>;
    }
    return (
      <>
        <ul className="space-y-2">
          {history.map((item: RecentActivity) => (
            <li key={item.transactionHash} className="bg-retro-gray-2 p-2 border-2 border-retro-gray-3">
              <p className="font-bold">Address: <span className="font-pixel-operator-mono">{item.user}</span></p>
              <div className="flex justify-between text-sm">
                <span className="font-bold">Deposit: <span className="font-pixel-operator-mono-bold text-retro-purple">{item.amount}</span></span>
                {/* Format the Unix timestamp into a readable date */}
                <span className="font-pixel-operator-mono">{format(new Date(Number(item.timestamp) * 1000), 'PPpp')}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className='mt-4'>
          <RetroButton onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </RetroButton>
        </div>
      </>
    );
  };

  return (
    <Window title="📜 RAFFLE ACTIVITIES 📜" className='h-fit'>
      <div className='p-4'>
        {renderContent()}
      </div>
    </Window>
  );
};

export default RaffleHistory;