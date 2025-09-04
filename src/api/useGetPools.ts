import { useQuery } from "@tanstack/react-query";
import { gql, request } from 'graphql-request';
import { PoolType, RaffleStatus } from '@/types/raffle';

// Define the type for the GraphQL response
interface PoolsQueryResult {
  raffles: {
    id: string;
    name: string;
    symbol: string;
    createdAt: string;
    depositDeadline: string;
    drawTime: string;
    tokenAddress: string;
    status: string;
    totalDeposits: string;
    totalWeightedTickets: string;
    participantCount: string;
    winner: string;
    decimals: string;
  }[];
}

const GET_POOLS_QUERY = gql`
  query GetPools {
    raffles(orderBy: createdAt, orderDirection: desc) {
      id
      name
      symbol
      createdAt
      depositDeadline
      drawTime
      tokenAddress
      status
      totalDeposits
      totalWeightedTickets
      participantCount
      winner
      decimals
    }
  }
`;

// Custom hook
export const useGetPools = () => {
  return useQuery<PoolType[]>({
    queryKey: ["fetchPools"],
    queryFn: async () => {
      const endpoint = process.env.NEXT_PUBLIC_THE_GRAPH || '';
      const data = await request<PoolsQueryResult>(endpoint, GET_POOLS_QUERY);
      // Map the raw data to the PoolType, ensuring status is correctly typed
      return data.raffles.map(raffle => ({
        ...raffle,
        status: raffle.status as RaffleStatus,
      }));
    },
  });
};

export default useGetPools;
