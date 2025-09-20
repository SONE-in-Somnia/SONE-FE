// src/api/useGetRaffleDetailsWithFallback.ts

import { useState, useEffect } from "react";
import { useGetRaffleDetailsRPC } from "./useGetRaffleDetailsRPC";
import { useReadContracts, useAccount } from "wagmi";
import { type Address, formatUnits } from "viem";
import prizePoolAbi from "@/abi/PrizePool.json";
import { PrizePoolData, RaffleStatus } from "@/types/raffle";

const initialData: PrizePoolData = {
  name: "",
  symbol: "",
  token: "0x",
  prizePoolAddress: '0x',
  depositDeadline: 0,
  drawTime: 0,
  totalDeposits: "0",
  totalWeightedTickets: "0",
  totalInterest: "0",
  yieldProtocolAddress: "0x",
  winner: "0x",
  userDeposit: "0",
  userWeightedTickets: "0",
  isUserWinner: false,
  userWinRate: 0,
  participantCount: 0,
  isLoading: true,
  error: null,
  status: RaffleStatus.IN_PROGRESS, // Default status
};

export const useGetRaffleDetailsWithFallback = (prizePoolAddress?: Address, userAddress?: Address) => {
  const { address: connectedAddress } = useAccount();
  const targetAddress = userAddress || connectedAddress;

  // --- Primary Hook ---
  const primary = useGetRaffleDetailsRPC(prizePoolAddress, targetAddress);

  // --- Fallback State and Logic ---
  const [fallbackData, setFallbackData] = useState<PrizePoolData>(initialData);
  const [shouldTriggerFallback, setShouldTriggerFallback] = useState(false);

  const prizePoolContract = {
    address: prizePoolAddress!,
    abi: prizePoolAbi.abi as any,
  } as const;

  const fallbackQuery = useReadContracts({
    contracts: [
      // Contract details
      { ...prizePoolContract, functionName: "name" }, // Fetch name directly
      { ...prizePoolContract, functionName: "symbol" }, // Fetch symbol directly
      { ...prizePoolContract, functionName: "token" },
      { ...prizePoolContract, functionName: "depositDeadline" },
      { ...prizePoolContract, functionName: "drawTime" },
      { ...prizePoolContract, functionName: "totalDeposits" },
      { ...prizePoolContract, functionName: "totalWeightedTickets" },
      { ...prizePoolContract, functionName: "totalInterest" },
      { ...prizePoolContract, functionName: "v" }, // yieldProtocolAddress
      { ...prizePoolContract, functionName: "winner" },
      { ...prizePoolContract, functionName: "count" }, // participantCount
      // User-specific details (only if address is present)
      ...(targetAddress ? [
        { ...prizePoolContract, functionName: "deposits", args: [targetAddress] },
        { ...prizePoolContract, functionName: "weightedTickets", args: [targetAddress] },
        { ...prizePoolContract, functionName: "isWinner", args: [targetAddress] },
        { ...prizePoolContract, functionName: "getWinRate", args: [targetAddress] },
      ] : []),
    ],
    query: {
      enabled: shouldTriggerFallback, // Only run this query if the fallback is triggered
    },
  });

  // Effect to decide whether to use primary or trigger fallback
  useEffect(() => {
    if (!primary.isLoading && primary.error?.includes("Prize pool not found in manager")) {
      console.log("Primary hook failed to find pool in manager. Triggering fallback...");
      setShouldTriggerFallback(true);
    } else if (!primary.isLoading) {
        // Primary hook succeeded or failed for another reason, so we use its data
        setShouldTriggerFallback(false);
    }
  }, [primary.isLoading, primary.error]);

  // Effect to process the results of the fallback query
  useEffect(() => {
    if (fallbackQuery.data && shouldTriggerFallback) {
        console.log("Processing fallback data...");
        const results = fallbackQuery.data.map(d => d.result);

        const decimals = 18; // This should ideally be dynamic

        const depositDeadline = Number(results[3] as bigint);
        const drawTime = Number(results[4] as bigint);
        const winner = results[9] as Address;

        const now = Date.now() / 1000;
        let status: RaffleStatus;

        if (winner !== '0x0000000000000000000000000000000000000000') {
          status = RaffleStatus.COMPLETED;
        } else if (now < depositDeadline) {
          status = RaffleStatus.IN_PROGRESS;
        } else {
          status = RaffleStatus.DRAW_CLOSED;
        }

        const formattedData: PrizePoolData = {
            name: results[0] as string,
            symbol: results[1] as string,
            token: results[2] as Address,
            prizePoolAddress: prizePoolAddress!, // Add prizePoolAddress
            depositDeadline: depositDeadline,
            drawTime: drawTime,
            totalDeposits: formatUnits(results[5] as bigint, decimals),
            totalWeightedTickets: formatUnits(results[6] as bigint, decimals),
            totalInterest: formatUnits(results[7] as bigint, decimals),
            yieldProtocolAddress: results[8] as Address,
            winner: winner,
            participantCount: Number(results[10] as bigint),
            userDeposit: targetAddress ? formatUnits(results[11] as bigint, decimals) : "0",
            userWeightedTickets: targetAddress ? formatUnits(results[12] as bigint, decimals) : "0",
            isUserWinner: targetAddress ? (results[13] as boolean) : false,
            userWinRate: targetAddress ? Number(results[14] as bigint) / 10000 : 0, // Convert from parts-per-million to percentage
            isLoading: false,
            error: null,
            status: status, // Assign the calculated status
        };
        setFallbackData(formattedData);
    }
  }, [fallbackQuery.data, shouldTriggerFallback, targetAddress, prizePoolAddress]);

  // Determine final state to return
  if (!shouldTriggerFallback) {
    // Ensure primary.data also has status and prizePoolAddress
    const primaryDataWithStatusAndAddress = primary.data ? {
      ...primary.data,
      status: primary.data.status, // Status is already calculated in primary.data
      prizePoolAddress: prizePoolAddress!, // Add prizePoolAddress
    } : undefined;

    return {
      ...primary,
      data: primaryDataWithStatusAndAddress,
      refetch: primary.refetch,
      
    }; // Use the result from the original hook
  } else {
    // Use the result from our fallback logic
    return {
        data: fallbackData,
        isLoading: fallbackQuery.isLoading,
        error: fallbackQuery.isError ? "Failed to fetch raffle details directly." : null, refetch: () => { setShouldTriggerFallback(true); },
    };
  }
};
