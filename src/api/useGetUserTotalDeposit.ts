// src/api/useGetUserTotalDeposit.ts
import { useAccount, useReadContract } from 'wagmi';
import { KuroABI } from '@/abi/KuroABI';
import { formatUnits } from 'viem';

const KURO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KURO_CONTRACT_ADDRESS || '0x...';

export const useGetUserTotalDeposit = () => {
  const { address } = useAccount();

  const { data: totalDeposit, isLoading: isLoadingTotalDeposit } = useReadContract({
    abi: KuroABI,
    address: KURO_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'deposits',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only run the query if the user is connected
    },
  });

  const formattedTotalDeposit = totalDeposit ? parseFloat(formatUnits(totalDeposit as bigint, 18)).toFixed(2) : '0.00';

  return { formattedTotalDeposit, isLoadingTotalDeposit };
};
