"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useGetPoolsRPC } from '@/api/useGetPoolsRPC';
import { PrizePool, PrizePoolData, RaffleStatus } from '@/types/raffle';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { parseEther, formatUnits, Abi, Address } from 'viem';
import prizePoolAbi from "@/abi/PrizePool.json"; // This imports the entire JSON artifact
import { prizePoolManager } from "@/contracts"; // This imports the addresss
import { ERC20ABI } from "@/abi/ERC20ABI";
 import { toast } from "react-toastify";



export enum RaffleDataLevel {
  SUMMARY = 'SUMMARY',
  DETAILED = 'DETAILED',
}

export type CachedRaffle =
  | {
    level: RaffleDataLevel.SUMMARY;
    data: PrizePool;
    lastUpdated: number;
  }
  | {
    level: RaffleDataLevel.DETAILED;
    data: PrizePoolData;
    lastUpdated: number;
  };

export type RaffleCache = {
  [key: string]: CachedRaffle;
};

interface RaffleContextType {
  raffles: RaffleCache;
  isLoadingList: boolean;
  isLoadingDetails: { [key: string]: boolean };
  error: Error | null;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  handleDeposit: (prizePoolAddress: Address) => void;
  isDepositing: boolean;
  fetchRaffles: () => Promise<void>;
  getRaffleDetails: (
    prizePoolAddress: Address,
    forceRefresh?: boolean
  ) => Promise<PrizePoolData | null>;
  handleWithdraw: (prizePoolAddress: Address) => void;
  isWithdrawing: boolean;
  handleApprove: (prizePoolAddress: Address) => Promise<void>;
  isApproving: boolean;
  checkAllowance: (prizePoolAddress: Address) => Promise<bigint | null>;


}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const RaffleProvider = ({ children }: { children: ReactNode }) => {
  const [raffles, setRaffles] = useState<RaffleCache>({});
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<Error | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const fetchRaffles = useCallback(async () => {
    if (!publicClient) return;

    setIsLoadingList(true);
    setError(null);
    try {
      // 1. Fetch the list of all pools from Manager
      const poolsData = await publicClient.readContract({
        address: prizePoolManager.address,
        abi: prizePoolManager.abi.abi as Abi,
        functionName: "fetchPools",
      });
      if (!Array.isArray(poolsData) || poolsData.length === 0) {
        setRaffles({});
        setIsLoadingList(false);
        return;
      }
      const typedPoolsData = poolsData as {
        name: string;
        symbol: string;
        prizePoolAddress: Address;
        tokenAddress: Address;
        yieldProtocolAddress: Address;
        depositionDeadline: bigint;
        withdrawalTime: bigint;
      }[];

      // 2. Prepare multicall to get summary detail for each pool
      const poolDetailsContracts = typedPoolsData.flatMap((pool) => [
        {
          address: pool.prizePoolAddress,
          abi: prizePoolAbi.abi as Abi,
          functionName: 'totalDeposits',
        },
        {
          address: pool.prizePoolAddress,
          abi: prizePoolAbi.abi as Abi,
          functionName: 'count',
        },
        {
          address: pool.prizePoolAddress,
          abi: prizePoolAbi.abi as Abi,
          functionName: 'winner',
        }
      ]);
      type MulticallResult = {
        result: bigint | Address | undefined;
        status: 'success' | 'failure';
      };
      const poolDetailsResults = (await publicClient.multicall({
        contracts: poolDetailsContracts,
        allowFailure: false
      })) as MulticallResult[];
      // 3. Process the results and update the cache
      const newRaffles: RaffleCache = {};
      const now = Date.now();

      typedPoolsData.forEach((pool, index) => {
        const baseIndex = index * 3;
        const totalDepositsBigInt = (poolDetailsResults[baseIndex]?.result || 0n) as bigint;
        const participantCountBigInt = (poolDetailsResults[baseIndex + 1]?.result || 0n) as bigint;
        const winnerAddress = (poolDetailsResults[baseIndex + 2]?.result || '0x0000000000000000000000000000000000000000') as Address;
        const decimals = 18;

        let currentTime = now / 1000;
        let status: RaffleStatus;

        if (winnerAddress !== '0x0000000000000000000000000000000000000000') {
          status = RaffleStatus.COMPLETED;
        } else if (currentTime < Number(pool.depositionDeadline)) {
          status = RaffleStatus.IN_PROGRESS;
        } else if (currentTime < Number(pool.withdrawalTime)) {
          status = RaffleStatus.DEPOSIT_CLOSED;
        } else {
          status = RaffleStatus.DRAW_CLOSED;
        }

        newRaffles[pool.prizePoolAddress] = {
          level: RaffleDataLevel.SUMMARY,
          data: {
            name: pool.name,
            symbol: pool.symbol,
            prizePoolAddress: pool.prizePoolAddress,
            tokenAddress: pool.tokenAddress,
            yieldProtocolAddress: pool.yieldProtocolAddress,
            depositionDeadline: Number(pool.depositionDeadline),
            withdrawalTime: Number(pool.withdrawalTime),
            totalDeposits: formatUnits(totalDepositsBigInt, decimals),
            participantCount: Number(participantCountBigInt),
            winner: winnerAddress,
            status: status,
          },
          lastUpdated: now,
        };
      });
      setRaffles(newRaffles);
    } catch(err) {
      setError(err as Error);
    } finally {
      setIsLoadingList(false);
    }
  }, [publicClient]);

  const fetchUserSpecificDetails = useCallback(
    async (prizePoolAddress: Address, userAddress: Address) => {
      if (!publicClient) return null;

      try {
        const userSpecificContracts = [
          {
            address: prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: 'deposits',
            args: [userAddress],
          },
          {
            address: prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: 'getWinRate',
            args: [userAddress],
          },
          {
            address: prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: 'isWinner',
            args: [userAddress],
          },
        ];

        const results = (await publicClient.multicall({
          contracts: userSpecificContracts,
          allowFailure: false,
        })) as { result: bigint | boolean | undefined }[];

        const decimals = 18; // Use dynamic decimals later

        return {
          userDeposit: formatUnits((results[0].result || 0n) as bigint, decimals),
          userWinRate: Number((results[1].result || 0n) as bigint),
          isUserWinner: results[2].result as boolean,
        };
      } catch (err) {
        console.error("Falied to fetch user specific details:", err);
        // return default values on error
        return {
          userDeposit: '0',
          userWinRate: 0,
          isUserWinner: false
        };
      }
    },[publicClient]);

  const getRaffleDetails = useCallback(
    async (prizePoolAddress: Address, forceRefresh = false) => {
      const now = Date.now();
      const cachedRaffle = raffles[prizePoolAddress];

      // 1. Check fresh data in cache, if so return it
      if (
        !forceRefresh &&
        cachedRaffle &&
        cachedRaffle.level === RaffleDataLevel.DETAILED &&
        now - cachedRaffle.lastUpdated < CACHE_DURATION
      ) {
        return cachedRaffle.data as PrizePoolData;
      }

      setIsLoadingDetails((prev) => ({ ...prev, [prizePoolAddress]: true }));
      setError(null);

      try {
        // 2. ensure summary data exists. Fetch if it's missing or stale.
        if (!cachedRaffle || forceRefresh) {
          await fetchRaffles();
        }

        // re-check the cache after fetching
        const summaryCache = raffles[prizePoolAddress];
        if (!summaryCache || summaryCache.level !== RaffleDataLevel.SUMMARY) {
          throw new Error('Failed to get raffle summary data.');
        }
        const summaryData = summaryCache.data as PrizePool;

        // 3. Assemble the detailed data object.
        let detailedData: PrizePoolData;

        // 4. If wallet is connected, fetch user-specific details.
        if (address) {
          const userDetails = await fetchUserSpecificDetails(prizePoolAddress, address);
          if (userDetails) {
            detailedData = {
              ...summaryData,
                token: summaryData.tokenAddress as Address,
                depositDeadline: summaryData.depositionDeadline,
                drawTime: summaryData.withdrawalTime,
                ...userDetails,
                // Placeholder
                totalWeightedTickets: '0',
                totalInterest: '0',
                userWeightedTickets: '0',
                isLoading: false,
                error: null,
              };
              // Update cache with full detailed data
              setRaffles((prev) => ({
                ...prev,
                [prizePoolAddress]: {
                  level: RaffleDataLevel.DETAILED, 
                  data: detailedData,
                  lastUpdated: now,
                },
              }));
          } else {
            throw new Error('Failed to fetch user details.');
            }
        } else {
          // 5. If wallet is not connected, create PrizePoolData with default user values.
            detailedData = {
              ...summaryData,
              token: summaryData.tokenAddress as Address,
              depositDeadline: summaryData.depositionDeadline,
              drawTime: summaryData.withdrawalTime,
              userDeposit: '0',
              userWinRate: 0,
              isUserWinner: false,
              totalWeightedTickets: '0',
              totalInterest: '0',
              userWeightedTickets: "0",
              isLoading: false,
              error: null,
            };
        }
        return detailedData;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsLoadingDetails((prev) => ({
          ...prev,
          [prizePoolAddress]: false
        }));
        }
    }, [raffles, address, fetchRaffles, fetchUserSpecificDetails]);
  
  // -- write function --
  const { writeContractAsync, isPending: isDepositing } = useWriteContract();
  const handleDeposit = useCallback(
    async (prizePoolAddress: Address) => {
      if (!publicClient || !address) return;

      try {
        const { request } = await publicClient.simulateContract({
          address: prizePoolAddress,
          abi: prizePoolAbi.abi as Abi,
          functionName: 'deposit',
          args: [parseEther(depositAmount || '0')],
          account: address,
        });
        await writeContractAsync(request);
        // After successful deposit, force a refresh of this raffle's details
        await getRaffleDetails(prizePoolAddress, true);
      } catch (err) {
        setError(err as Error);
      }
    },
    [publicClient, address, depositAmount, writeContractAsync, getRaffleDetails]
  );

  const { writeContractAsync: withdrawAsync, isPending: isWithdrawing } = useWriteContract();

  const handleWithdraw = useCallback(
    async (prizePoolAddress: Address) => {
      if (!publicClient || !address) return;

      try {
        const { request } = await publicClient.simulateContract({
          address: prizePoolAddress,
          abi: prizePoolAbi.abi as Abi,
          functionName: 'withdraw',
          account: address,
        });
        await withdrawAsync(request);
        // After successful withdrawal, force a refresh
        await getRaffleDetails(prizePoolAddress, true);
      } catch (err) {
        setError(err as Error);
      }
    },
    [publicClient, address, withdrawAsync, getRaffleDetails]
  );

  const handleApprove = useCallback(
    async (prizePoolAddress: Address) => {
      // get token address from raffle data cache
      const raffleData = raffles[prizePoolAddress]?.data;
      if (!publicClient || !address || !raffleData) {
        toast.error("Raffle data not found.");
        return;
      }

      // the address of the token we need to approve
      const tokenToApprove = (raffleData as PrizePoolData).token || (raffleData as PrizePool).tokenAddress;

      setIsApproving(true);
      setError(null);
      try {
        const { request } = await publicClient.simulateContract({
          address: tokenToApprove,
          abi: ERC20ABI,
          functionName: "approve",
          args: [
            prizePoolAddress, // spender
            parseEther(depositAmount || "0"),
          ],
          account: address,
        });

        await writeContractAsync(request);

        toast.success("Approval successful! You can now deposit.");
      } catch (err) {
        setError(err as Error);
        toast.error("Approval failed. Please try again.")
      } finally {
        setIsApproving(false);
      }
    }, [publicClient, address, raffles, depositAmount, writeContractAsync]
  );

  const checkAllowance = useCallback(
    async (prizePoolAddress: Address) => {
      const raffleData = raffles[prizePoolAddress]?.data;
      if (!publicClient || !address || !raffleData) {
        return null;
      }

      const tokenAddress = (raffleData as PrizePoolData).token || (raffleData as PrizePool).tokenAddress;

      try {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20ABI,
          functionName: "allowance",
          args: [
            address, // the owner of the tokens
            prizePoolAddress, // the spender
          ],
        });
        return allowance as bigint;
      } catch (err) {
        console.error("Falied to check allowance", err);
        setError(err as Error);
        return null;
      }
    }, [publicClient, address, raffles]
  );



  return (
    <RaffleContext.Provider
      value={{
        raffles,
        isLoadingList,
        isLoadingDetails,
        error,
        depositAmount,
        setDepositAmount,
        handleDeposit,
        isDepositing,
        fetchRaffles,
        getRaffleDetails,
        handleWithdraw,
        isWithdrawing,
        handleApprove,
        isApproving,
        checkAllowance,
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
