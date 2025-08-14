// src/api/useGetWinChance.ts
import { useAccount, useReadContract } from 'wagmi';
import { KuroABI } from '@/abi/KuroABI';

const KURO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KURO_CONTRACT_ADDRESS || '0x...';

export const useGetWinChance = () => {
  const { address } = useAccount();

  const { data: winChance, isLoading: isLoadingWinChance } = useReadContract({
    abi: KuroABI,
    address: KURO_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'getWinRate',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only run the query if the user is connected
    },
  });

  // The win rate is returned as a percentage (e.g., 10 for 10%), so we format it.
  const formattedWinChance = winChance ? `${winChance.toString()}%` : '0%';

  return { formattedWinChance, isLoadingWinChance };
};
