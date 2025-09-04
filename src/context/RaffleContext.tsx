"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetPoolsRPC as useGetPools } from '@/api/useGetPoolsRPC';
import { useWritePrizePoolDeposit, useSimulatePrizePoolDeposit } from '@/generated';
import { PoolType } from '@/types/raffle';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';

interface RaffleContextType {
  raffles: PoolType[];
  isLoading: boolean;
  selectedRaffle: PoolType | null;
  setSelectedRaffleById: (raffleId: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  handleDeposit: () => void;
  isDepositing: boolean;
  error: Error | null;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const RaffleProvider = ({ children }: { children: ReactNode }) => {
  const { data: raffles = [], isLoading, error } = useGetPools();
  const [selectedRaffle, setSelectedRaffle] = useState<PoolType | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const { address } = useAccount();

  const {
    data: simulationData,
    error: simulationError,
    isPending: isSimulating,
  } = useSimulatePrizePoolDeposit({
    value: parseEther(depositAmount || '0'),
  });

  const {
    writeContract: deposit,
    isPending: isDepositing,
    error: depositError,
  } = useWritePrizePoolDeposit();

  const setSelectedRaffleById = (raffleId: string) => {
    const raffle = raffles.find(r => r.name === raffleId) || null;
    setSelectedRaffle(raffle);
  };

  const handleDeposit = () => {
    if (simulationData?.request) {
        deposit(simulationData.request);
    }
  };

  return (
    <RaffleContext.Provider
      value={{
        raffles,
        isLoading,
        selectedRaffle,
        setSelectedRaffleById,
        depositAmount,
        setDepositAmount,
        handleDeposit,
        isDepositing: isDepositing || isSimulating,
        error: error || depositError || simulationError,
      }}
    >
      {children}
    </RaffleContext.Provider>
  );
};

export const useRaffle = () => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};
