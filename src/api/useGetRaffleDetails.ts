
// src/api/useGetRaffleDetails.ts

// Line 1: Import necessary libraries
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { RaffleDetailsType } from "@/types/raffle"; // Assuming this type definition exists

// Line 2: Define the hook function
const useGetRaffleDetails = (poolId: string) => {
  // Line 3: Use the useQuery hook from TanStack Query
  return useQuery<RaffleDetailsType>({
    // Line 4: Define a unique key for this query
    queryKey: ["GET_RAFFLE_DETAILS", poolId],
    // Line 5: Define the asynchronous function to fetch data
    queryFn: async () => {
      // Line 6: Define the GraphQL query
      const query = gql`
        query GetRaffleDetails($poolId: String!) {
          pool(id: $poolId) {
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
            totalPrize
            userTotalDeposit
            activities {
              user
              amount
              timestamp
              transactionHash
            }
          }
        }
      `;

      // Line 7: Get the API URL from environment variables
      const url = process.env.NEXT_PUBLIC_THE_GRAPH || "";

      // Line 8: Make the API request using graphql-request
      const res: { pool: RaffleDetailsType } = await request({
        url: url,
        document: query,
        variables: { poolId }, // Pass the poolId as a variable
        requestHeaders: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });

      // Line 9: Return the fetched pool data
      return res.pool;
    },
    // Line 10: Ensure the query only runs if poolId is provided
    enabled: !!poolId,
  });
};

// Line 11: Export the hook
export default useGetRaffleDetails;
