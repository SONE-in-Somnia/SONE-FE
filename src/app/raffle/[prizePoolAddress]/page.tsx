// src/app/raffle/[prizePoolAddress]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetRaffleDetailsRPC } from '@/api/useGetRaffleDetailsRPC';
import { useAccount } from 'wagmi';

// Core components for the page
import RaffleDetailsCard from '@/views/raffle/RaffleDetailsCard';
import WinnerInfo from '@/components/raffle/WinnerInfo';
import RaffleHistory from '@/components/raffle/RaffleHistory';
import RaffleDeposit from '@/components/raffle/RaffleDeposit';

// UI chrome and layout components
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

const RaffleDetailPage = () => {
  const params = useParams();
  const prizePoolAddress = params?.prizePoolAddress as `0x${string}` | undefined;
  const { address } = useAccount();

  const {
    data: raffle,
    isLoading,
    error // Removed isError
  } = useGetRaffleDetailsRPC(prizePoolAddress, address);

  // --- DEBUG: Log the data from the hook ---
  console.log('--- RaffleDetailPage Debug ---');
  console.log('prizePoolAddress from URL:', prizePoolAddress);
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('Raw raffle data from useGetRaffleDetailsRPC:', raffle);
  console.log('------------------------------');

  if (!prizePoolAddress) {
    return (
        <RetroPanel title="Error" className='flex justify-center bg-red-700 h-fit max-w-[100%] w-[100%]'>
            <div className="text-center text-white py-16">
                <p className="text-2xl font-bold mb-2">Invalid Raffle Address</p>
                <p>The address for the raffle was not found in the URL.</p>
            </div>
        </RetroPanel>
    );
  }

  // Define breadcrumb here, after prizePoolAddress is confirmed and before raffle is checked
  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/raffle" className="text-white font-thin">Raffles</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-white" />
        <BreadcrumbItem>
          {/* Use prizePoolAddress directly here, as raffle.name is not available in PrizePoolData */}
          <BreadcrumbPage className="text-white font-extrabold">Raffle #{prizePoolAddress}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (isLoading) {
    return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%]'>
        <div className="grid grid-cols-3 gap-4 p-2 max-w-[100%]">
          <div className="col-span-2 space-y-4">
            <RaffleCardSkeleton />
          </div>
          <div className="space-y-6">
            <RaffleCardSkeleton />
          </div>
        </div>
      </RetroPanel>
    );
  }

  // Changed from isError || !raffle to error || !raffle
  if (error || !raffle) {
    return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%]'>
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">Raffle not found!</p>
          <p>Could not load details for raffle #{prizePoolAddress}.</p>
        </div>
      </RetroPanel>
    );
  }

  // Re-define breadcrumb here, now that raffle is guaranteed to be valid
  const validRaffleBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/raffle" className="text-white font-thin">Raffles</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-white" />
        <BreadcrumbItem>
          {/* Use prizePoolAddress as name is not available in PrizePoolData */}
          <BreadcrumbPage className="text-white font-extrabold">{raffle.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <RetroPanel title="Raffle Details" headerContent={validRaffleBreadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%]'>
      <div className="grid grid-cols-3 gap-4 p-2 max-w-[100%]">
        <div className="col-span-2 space-y-4">
          <WinnerInfo winner={raffle.winner} />
          <RaffleDetailsCard raffle={raffle} />
        </div>
        <div className="space-y-6">
          <RaffleDeposit
            depositDeadline={raffle.depositDeadline}
            prizePoolAddress={prizePoolAddress}
            userTotalDeposit={raffle.userDeposit}
          />
        </div>
      </div>
      <div className="mt-2">
        <RaffleHistory raffle={raffle} />
      </div>
    </RetroPanel>
  );
};

export default RaffleDetailPage;