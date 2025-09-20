import { useState, useEffect } from "react";
import { Address, PublicClient, formatUnits, Abi } from "viem";
import { usePublicClient } from "wagmi";
import { prizePoolManager } from "@/contracts";
import prizePoolAbi from "@/abi/PrizePool.json"; // This imports the entire JSON artifact
import { PrizePool, PrizePoolList, RaffleStatus } from "@/types/raffle"; // Updated import

export const useGetPoolsRPC = () => {
  const publicClient = usePublicClient();

  const [data, setData] = useState<PrizePoolList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      if (!publicClient) {
        setError("Public client not available.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all pools data from PrizePoolManager
        const poolsData = await publicClient.readContract({
          address: prizePoolManager.address,
          abi: prizePoolManager.abi.abi,
          functionName: "fetchPools",
        });

        if (!Array.isArray(poolsData) || poolsData.length === 0) {
          setData([]);
          setIsLoading(false);
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

        // Prepare multicall for additional pool details
        const poolDetailsContracts = typedPoolsData.flatMap((pool) => [
          {
            address: pool.prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: "totalDeposits",
          },
          {
            address: pool.prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: "count", // Assuming 'count' is participantCount
          },
          {
            address: pool.prizePoolAddress,
            abi: prizePoolAbi.abi as Abi,
            functionName: "winner",
          },
        ]);

        // Define a type for the expected result of each multicall item
        type MulticallResult = { result: bigint | Address | undefined; status: 'success' | 'failure' };

        const poolDetailsResults = await publicClient.multicall({
          contracts: poolDetailsContracts,
          allowFailure: false,
        }) as MulticallResult[]; // Cast the entire array

        const formattedPools: PrizePoolList = typedPoolsData.map((pool, index) => {
          const baseIndex = index * 3;
          // Access results with type safety and provide default values for undefined
          const totalDepositsBigInt = (poolDetailsResults[baseIndex]?.result || 0n) as bigint;
          const participantCountBigInt = (poolDetailsResults[baseIndex + 1]?.result || 0n) as bigint;
          const winnerAddress = (poolDetailsResults[baseIndex + 2]?.result || '0x0000000000000000000000000000000000000000') as Address; // Default to zero address

          // Assuming depositToken has 18 decimals for formatting
          const decimals = 18;

          // Calculate status
          const now = Date.now() / 1000;
          let status: RaffleStatus;

          if (winnerAddress !== '0x0000000000000000000000000000000000000000') {
            status = RaffleStatus.COMPLETED;
          } else if (now < Number(pool.depositionDeadline)) {
            status = RaffleStatus.IN_PROGRESS;
          } else if (now < Number(pool.withdrawalTime)) {
            status = RaffleStatus.DEPOSIT_CLOSED;
          } else {
            status = RaffleStatus.DRAW_CLOSED;
          }

          return {
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
            status: status, // Assign the calculated status
          };
        });

        setData(formattedPools);
      } catch (err) {
        console.error("Failed to fetch pools:", err);
        setError((err as Error).message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, [publicClient]);

  return { data, isLoading, error };
};