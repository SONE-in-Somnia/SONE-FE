// src/api/useGetRaffleDetailsRPC.ts

import { useState, useEffect } from "react";
import { Address, PublicClient, formatUnits, Abi } from "viem";
import { usePublicClient, useAccount } from "wagmi";
import prizePoolAbi from "@/abi/PrizePool.json" assert { type: "json" };
import { prizePoolManager } from "@/contracts";
import { PrizePoolData } from "@/types/raffle";

export const useGetRaffleDetailsRPC = (prizePoolAddress?: Address, userAddress?: Address) => {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient();
  const targetAddress = userAddress || connectedAddress;

  const [data, setData] = useState<PrizePoolData>({
    name: "",
    symbol: "",
    token: "0x",
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
  });

  useEffect(() => {
    const fetchRaffleDetails = async () => {
      if (!prizePoolAddress || !publicClient) {
        setData((prev) => ({ ...prev, isLoading: false, error: "Missing prizePoolAddress or publicClient" }));
        return;
      }

      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Fetch name and symbol from PrizePoolManager
        const allPoolsData = await publicClient.readContract({
          address: prizePoolManager.address,
          abi: prizePoolManager.abi.abi,
          functionName: "fetchPools",
        });

        const currentPoolBasicData = (allPoolsData as any[]).find(
          (pool) => pool.prizePoolAddress.toLowerCase() === prizePoolAddress.toLowerCase()
        );

        if (!currentPoolBasicData) {
          throw new Error("Prize pool not found in manager.");
        }

        // Fetch general pool data
        const multicallResults = await publicClient.multicall({
          contracts: [
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "token",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "depositDeadline",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "drawTime",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "totalDeposits",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "totalWeightedTickets",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "totalInterest",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "v", // Assuming 'v' is yieldProtocolAddress
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "winner",
            },
            {
              address: prizePoolAddress,
              abi: prizePoolAbi.abi as Abi,
              functionName: "count", // Assuming 'count' is participantCount
            },
          ],
          allowFailure: true, // Allow individual calls to fail
        });

        // Destructure results and handle potential failures
        // Re-ordered and explicitly typed for clarity and to potentially resolve compiler issue
        const token = (multicallResults[0].status === 'success' ? multicallResults[0].result : '0x0000000000000000000000000000000000000000') as Address;
        const depositDeadline = (multicallResults[1].status === 'success' ? multicallResults[1].result : 0) as number;
        const drawTime = (multicallResults[2].status === 'success' ? multicallResults[2].result : 0) as number;
        const totalDepositsBigInt = (multicallResults[3].status === 'success' ? multicallResults[3].result : 0n) as bigint;
        const totalWeightedTicketsBigInt = (multicallResults[4].status === 'success' ? multicallResults[4].result : 0n) as bigint;
        const totalInterestBigInt = (multicallResults[5].status === 'success' ? multicallResults[5].result : 0n) as bigint;
        const yieldProtocolAddress = (multicallResults[6].status === 'success' ? multicallResults[6].result : '0x0000000000000000000000000000000000000000') as Address;
        const winner = (multicallResults[7].status === 'success' ? multicallResults[7].result : '0x0000000000000000000000000000000000000000') as Address;
        const participantCountBigInt = (multicallResults[8].status === 'success' ? multicallResults[8].result : 0n) as bigint;


        // Fetch user-specific data if targetAddress is available
        let userDepositBigInt = 0n;
        let userWeightedTicketsBigInt = 0n;
        let isUserWinner = false;
        let userWinRate = 0;

        if (targetAddress) {
          const userMulticallResults = await publicClient.multicall({
            contracts: [
              {
                address: prizePoolAddress,
                abi: prizePoolAbi.abi as Abi,
                functionName: "deposits",
                args: [targetAddress],
              },
              {
                address: prizePoolAddress,
                abi: prizePoolAbi.abi as Abi,
                functionName: "weightedTickets",
                args: [targetAddress],
              },
              {
                address: prizePoolAddress,
                abi: prizePoolAbi.abi as Abi,
                functionName: "isWinner",
                args: [targetAddress],
              },
              {
                address: prizePoolAddress,
                abi: prizePoolAbi.abi as Abi,
                functionName: "getWinRate",
                args: [targetAddress],
              },
            ],
            allowFailure: true, // Allow individual calls to fail
          });

          userDepositBigInt = (userMulticallResults[0].status === 'success' ? userMulticallResults[0].result : 0n) as bigint;
          userWeightedTicketsBigInt = (userMulticallResults[1].status === 'success' ? userMulticallResults[1].result : 0n) as bigint;
          isUserWinner = (userMulticallResults[2].status === 'success' ? userMulticallResults[2].result : false) as boolean;
          userWinRate = (userMulticallResults[3].status === 'success' ? Number(userMulticallResults[3].result) : 0) as number;
        }

        // Assuming token is ERC20 and has 18 decimals for formatting
        const decimals = 18; // This should ideally be fetched from the ERC20 contract

        setData({
          name: currentPoolBasicData.name,
          symbol: currentPoolBasicData.symbol,
          token: token,
          depositDeadline: Number(depositDeadline),
          drawTime: Number(drawTime),
          totalDeposits: formatUnits(totalDepositsBigInt, decimals),
          totalWeightedTickets: formatUnits(totalWeightedTicketsBigInt, decimals),
          totalInterest: formatUnits(totalInterestBigInt, decimals),
          yieldProtocolAddress: yieldProtocolAddress,
          winner: winner,
          userDeposit: formatUnits(userDepositBigInt, decimals),
          userWeightedTickets: formatUnits(userWeightedTicketsBigInt, decimals),
          isUserWinner: isUserWinner,
          userWinRate: userWinRate,
          participantCount: Number(participantCountBigInt),
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch raffle details:", err);
        setData((prev) => ({ ...prev, isLoading: false, error: (err as Error).message }));
      }
    };

    fetchRaffleDetails();
  }, [prizePoolAddress, publicClient, targetAddress]);

  return { data, isLoading: data.isLoading, error: data.error };
};