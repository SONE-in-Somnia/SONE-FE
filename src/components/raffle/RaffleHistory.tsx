// src/components/raffle/RaffleHistory.tsx
'use client';
import React from 'react';
import Window from '@/views/home-v2/components/Window';
import { PoolType, RecentActivity } from '@/types/raffle';
import { format } from 'date-fns';
import useGetPoolActivities from '@/api/useGetPoolActivities'; // Updated import

const RaffleHistory = ({ raffle }: { raffle: PoolType }) => {
  const { data: history, isLoading } = useGetPoolActivities({ poolId: raffle.id }); // Use the new hook

  const renderContent = () => {
    if (isLoading) {
      return <p className='font-bold'>Loading activities...</p>;
    }
    if (!history || history.length === 0) {
      return <p className='font-bold'>No activities yet.</p>;
    }
    return (
      <>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {history.map((item: RecentActivity) => (
            <div key={item.transactionHash} className="flex-shrink-0 w-80 bg-retro-gray-2 p-3 border-2 border-retro-gray-3">
              <p className="font-bold truncate">Address: <span className="font-pixel-operator-mono">{item.user}</span></p>
              <p className="font-bold mt-1">Deposit: <span className="font-pixel-operator-mono-bold text-retro-purple relative top-0.5">{item.amount}</span></p>
              <p className="font-pixel-operator-mono text-xs text-right mt-3">{format(new Date(Number(item.timestamp) * 1000), 'PPpp')}</p>
            </div>
          ))}
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