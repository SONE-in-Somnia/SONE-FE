// src/app/raffle/[id]/page.tsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RaffleCard from '@/components/raffle/RaffleCard';
import RaffleDeposit from '@/components/raffle/RaffleDeposit';
import WinnerInfo from '@/components/raffle/WinnerInfo';
import RaffleHistory from '@/components/raffle/RaffleHistory';
import { useGetPoolById } from '@/api/useGetPoolById'; // Import the efficient hook
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
import WinnerInfoSkeleton from '@/skeleton/WinnerInfoSkeleton';
import RaffleHistorySkeleton from '@/skeleton/RaffleHistorySkeleton';
import Deposit from '@/views/magic-earn/Deposit';


const RafflePage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: raffleData, isLoading: loading, isError } = useGetPoolById(id);

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
          </div>
          <div className="space-y-8">
            <RaffleDepositSkeleton />
            <WinnerInfoSkeleton />
            <RaffleHistorySkeleton />
          </div>
        </div>
      </RetroPanel>
    );
  }

  if (isError || !raffleData) {
    return (
      <RetroPanel title="Not Found" headerContent={breadcrumb} className='bg-red-700'>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl font-bold text-white">Raffle not found.</div>
        </div>
      </RetroPanel>
    );
  }

  return (
    <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='bg-green-700'>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2">
        <div className="lg:col-span-2 space-y-4">
          <RaffleCard raffle={raffleData} showParticipateButton={false} showExtraInfo={true} />
          <WinnerInfo raffle={raffleData} />
        </div>
        {/* Right column setup for proportional height */}
        <div className="flex flex-col gap-4">
          {/* Add flex-grow to this component to make it take up available space */}
          <div className="flex-grow">
            <RaffleDeposit />
          </div>
          <div>
            <RaffleHistory poolId={raffleData.id} />
          </div>
        </div>
      </div>
    </RetroPanel>
  );
};

export default RafflePage;