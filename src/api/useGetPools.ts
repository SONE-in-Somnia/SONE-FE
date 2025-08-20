import { useQuery } from "@tanstack/react-query";
import { gql, request } from 'graphql-request';
import { PoolType } from '@/types/raffle';

const useGetPools = () => {
  return useQuery<PoolType[]>({
    queryKey: ["GET_POOLS"],
    queryFn: async () => {
      const query = gql`
        query GetPools {
          pools {
            id
            depositDeadline
            name
            poolAddress
            symbol
            startTime
            drawTime
            tokenAddress
            status
            totalDeposits
            participantCount
            winner
          }
        }
      `;

      const url = process.env.NEXT_PUBLIC_THE_GRAPH || "";
      const res: { pools: PoolType[] } = await request({
        url: url,
        document: query,
        requestHeaders: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      return res.pools;
    },
  });
};

export default useGetPools;
