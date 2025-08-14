// src/app/raffle/[id]/page.tsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RaffleCard from '@/components/raffle/RaffleCard';
import RaffleDeposit from '@/components/raffle/RaffleDeposit';
import PrizeInfo from '@/components/raffle/PrizeInfo';
import RaffleHistory from '@/components/raffle/RaffleHistory';
import { useGetRaffle } from '@/api/useGetRaffle';
import RetroPanel from '@/components/customized/RetroPanel';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton';
import RaffleDepositSkeleton from '@/skeleton/RaffleDepositSkeleton';
import PrizeInfoSkeleton from '@/skeleton/PrizeInfoSkeleton';
import RaffleHistorySkeleton from '@/skeleton/RaffleHistorySkeleton';

const RafflePage = () => {
  const params = useParams();
  const { id } = params;
  const { raffleData, loading } = useGetRaffle(id as string);

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/raffle" className='text-white font-thin'>Raffles</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='text-white' />
        <BreadcrumbItem>
          <BreadcrumbPage className='text-white font-extrabold'>Raffle #{id}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (loading) {
    return (
      <RetroPanel title="Loading..." headerContent={breadcrumb}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RaffleCardSkeleton />
            <RaffleDepositSkeleton />
          </div>
          <div className="space-y-8">
            <PrizeInfoSkeleton />
            <RaffleHistorySkeleton />
          </div>
        </div>
      </RetroPanel>
    );
  }

  if (!raffleData) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-bold">Raffle not found.</div>
    </div>;
  }

  return (
    <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='bg-green-700'>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2">
        <div className="lg:col-span-2 space-y-4">
          <RaffleCard raffle={raffleData} showParticipateButton={false} showExtraInfo={true} />
          <PrizeInfo prize={raffleData.prize} />

        </div>
        <div className="space-y-4">
          <RaffleDeposit raffle={raffleData} />
          <RaffleHistory />
        </div>
      </div>
    </RetroPanel>
  );
};

export default RafflePage;
