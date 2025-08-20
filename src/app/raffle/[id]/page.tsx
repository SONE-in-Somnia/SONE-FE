
// src/app/raffle/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import useGetRaffleDetails from '@/api/useGetRaffleDetails'; // Import the real hook

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
import RaffleCardSkeleton from '@/skeleton/RaffleCardSkeleton'; // Import skeleton for loading state

const RaffleDetailPage = ({ params }: { params: { id: string } }) => {
  const { data: raffle, isLoading, isError } = useGetRaffleDetails(params.id); // Use the hook to fetch data

  // Create the breadcrumb navigation element
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
          <BreadcrumbPage className="text-white font-extrabold">Raffle #{params.id}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (isLoading) {
    return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%] '>
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

  if (isError || !raffle) {
    return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%] '>
        <div className="text-center text-retro-black py-16">
          <p className="text-2xl font-bold mb-2">Raffle not found!</p>
          <p>Could not load details for raffle #{params.id}.</p>

        </div>
      </RetroPanel>
    );
  }

  // Success State: Display the fully rendered page within the RetroPanel
  return (
      <RetroPanel title="Raffle Details" headerContent={breadcrumb} className='flex justify-center bg-green-700 h-fit max-w-[100%] w-[100%] '>
        <div className="grid grid-cols-3 gap-4 p-2 max-w-[100%]">
          {/* Column 1: Core Raffle Info */}
          <div className="col-span-2 space-y-4">
            <WinnerInfo raffle={raffle} />
            <RaffleDetailsCard raffle={raffle} />
          </div>
          {/* Column 2: User-specific Info & Actions */}
          <div className="space-y-6">
            <RaffleDeposit depositDeadline={raffle.depositDeadline} />
          </div>
        </div>
        {/* Full-width Section for Activities */}
        <div className="mt-2">
          <RaffleHistory raffle={raffle} />
        </div>
      </RetroPanel>
  );
};

export default RaffleDetailPage;

