// src/api/useGetRaffleActivities.ts
import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import PrizePoolABI from '@/abi/PrizePool.json';

// Define a common interface for all raffle activities
export interface RaffleActivity {
  id: string; // Unique identifier for the activity (e.g., transaction hash + log index)
  transactionHash: Address;
  timestamp: string; // Unix timestamp
  player: Address;
  type: 'deposit' | 'win'; // No explicit withdrawal event in ABI, so only deposit and win for now
  amount?: string; // For deposits and claimed amounts
  tokenSymbol?: string; // For deposits and claimed amounts (will need to fetch token info)
}

interface UseGetRaffleActivitiesParams {
  prizePoolAddress?: Address;
  enabled?: boolean; // To control when the query runs
}

const fetchRaffleActivitiesFromRPC = async (prizePoolAddress: Address, publicClient: ReturnType<typeof usePublicClient>): Promise<RaffleActivity[]> => {
  if (!publicClient) {
    throw new Error("Public client not available.");
  }

  const activities: RaffleActivity[] = [];

  // Fetch Deposited events
  const depositLogs = await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      abi: PrizePoolABI.abi,
      name: 'Deposited',
      args: undefined,
    },
    fromBlock: 0n, // Start from block 0 or a known deployment block
    toBlock: 'latest',
  });

  for (const log of depositLogs) {
    if (log.args && log.args.user && log.args.amount) {
      // For tokenSymbol, you would typically fetch the token address from the PrizePool contract
      // and then query its symbol. For simplicity, we'll use a placeholder.
      const tokenSymbol = "ETH"; // Placeholder
      const decimals = 18; // Placeholder, ideally fetch from token contract

      activities.push({
        id: `${log.transactionHash}_${log.logIndex}`,
        transactionHash: log.transactionHash as Address,
        timestamp: (await publicClient.getBlock({
          blockHash: log.blockHash || undefined,
          blockNumber: log.blockNumber || undefined,
        })).timestamp.toString(),
        player: log.args.user as Address,
        type: 'deposit',
        amount: formatUnits(log.args.amount as bigint, decimals),
        tokenSymbol: tokenSymbol,
      });
    }
  }

  // Fetch Claimed events (considering them as win activities)
  const claimedLogs = await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      abi: PrizePoolABI.abi,
      name: 'Claimed',
      args: undefined,
    },
    fromBlock: 0n, // Start from block 0 or a known deployment block
    toBlock: 'latest',
  });

  for (const log of claimedLogs) {
    if (log.args && log.args.user && log.args.amount) {
      const tokenSymbol = "ETH"; // Placeholder
      const decimals = 18; // Placeholder

      activities.push({
        id: `${log.transactionHash}_${log.logIndex}`,
        transactionHash: log.transactionHash as Address,
        timestamp: (await publicClient.getBlock({
          blockHash: log.blockHash || undefined,
          blockNumber: log.blockNumber || undefined,
        })).timestamp.toString(),
        player: log.args.user as Address,
        type: 'win',
        amount: formatUnits(log.args.amount as bigint, decimals),
        tokenSymbol: tokenSymbol,
      });
    }
  }

  // Sort activities by timestamp (newest first)
  activities.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return activities;
};

export const useGetRaffleActivities = ({ prizePoolAddress, enabled = true }: UseGetRaffleActivitiesParams) => {
  const publicClient = usePublicClient();

  return useQuery<RaffleActivity[], Error>({
    queryKey: ['raffleActivities', prizePoolAddress],
    queryFn: () => {
      if (!prizePoolAddress) {
        throw new Error('Prize pool address is required to fetch raffle activities.');
      }
      if (!publicClient) {
        throw new Error('Public client is not available.');
      }
      return fetchRaffleActivitiesFromRPC(prizePoolAddress, publicClient);
    },
    enabled: enabled && !!prizePoolAddress && !!publicClient,
    // You might want to add refetchInterval, staleTime, etc. based on your needs
  });
};
