
'use client';

import { useRaffle } from '@/context/RaffleContext';
import { PrizePoolData } from '@/types/raffle';
import React, { useEffect, useState } from 'react'; // Import useEffect
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  const { getRaffleDetails, isLoadingDetails, error } = useRaffle();
  const [raffle, setRaffle] = useState<PrizePoolData | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (prizePoolAddress) {
      const fetchDetails = async () => {
        const details = await getRaffleDetails(prizePoolAddress);
        setRaffle(details);
      };
      fetchDetails();
    }
  }, [prizePoolAddress, getRaffleDetails]);

  const isLoading = isLoadingDetails[prizePoolAddress ?? ''] || !raffle;

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

  if (error || !raffle) {
    return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%]'>
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">Raffle not found!</p>
          <p>{error?.message || `Could not load details for raffle ${prizePoolAddress}.`}</p>
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
          {raffle && (
            <RaffleDeposit
              raffle={raffle}
            />
          )}
        </div>
      </div>
      <div className="mt-2">
        <RaffleHistory raffle={raffle} />
      </div>
    </RetroPanel>
  );
};

export default RaffleDetailPage;