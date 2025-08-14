// src/app/raffle/page.tsx
'use client';
import React, { useState } from 'react';
import { useGetRaffles } from '@/api/useGetRaffles';
import RaffleCard from '@/components/raffle/RaffleCard';
import Link from 'next/link';
import RetroPanel from '@/components/customized/RetroPanel';
import { RetroButton } from '@/components/RetroButton';
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton';

const RafflesPage = () => {
  const { raffles, loading } = useGetRaffles();
  const [activeTab, setActiveTab] = useState('in-progress');

  const filteredRaffles = raffles.filter((raffle) => raffle.status === activeTab);

  return (
    <RetroPanel title="Raffles" className='bg-green-700'>
      <div className="p-4">
        <div className="flex justify-center mb-8 gap-4">
          <RetroButton
            onClick={() => setActiveTab('in-progress')}
            className={activeTab === 'in-progress' ? 'bg-retro-blue text-white' : ''}
          >
            In Progress
          </RetroButton>
          <RetroButton
            onClick={() => setActiveTab('completed')}
            className={activeTab === 'completed' ? 'bg-retro-blue text-white' : ''}
          >
            Completed
          </RetroButton>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <RaffleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRaffles.map((raffle) => (
              <Link href={`/raffle/${raffle.id}`} key={raffle.id}>
                <RaffleCard raffle={raffle} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </RetroPanel>
  );
};

export default RafflesPage;
