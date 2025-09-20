
// src/api/useGetRaffleDetails.ts

// Line 1: Import necessary libraries
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { RaffleDetailsType, PlayerRaffleStatsType, RecentActivity, RaffleStatus } from '@/types/raffle';

// Define interfaces for the GraphQL responses
interface RaffleQueryResult {
  raffle: {
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
    totalPrizePool: string;
    decimals: string;
    activities: {
      player: { id: string };
      amount: string;
      timestamp: string;
      id: string;
    }[];
  };
}

interface PlayerStatsQueryResult {
  playerRaffleStats: {
    totalDepositedInRaffle: string;
    weightedTicketsInRaffle: string;
  } | null;
}

const useGetRaffleDetails = (poolId: string, userAddress?: string) => {
  return useQuery<RaffleDetailsType | null>({
    queryKey: ['GET_RAFFLE_DETAILS', poolId, userAddress],
    queryFn: async () => {
      const endpoint = process.env.NEXT_PUBLIC_THE_GRAPH || '';

      const raffleQuery = gql`
        query GetRaffleDetails($poolId: ID!) {
          raffle(id: $poolId) {
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
            totalPrizePool
            decimals
            activities(first: 10, orderBy: timestamp, orderDirection: desc) {
              ... on RaffleDeposit {
                player {
                  id
                }
                amount
                timestamp
                id
              }
            }
          }
        }
      `;

      const playerStatsQuery = gql`
        query GetPlayerRaffleStats($playerId: ID!) {
          playerRaffleStats(id: $playerId) {
            totalDepositedInRaffle
            weightedTicketsInRaffle
            winChance
          }
        }
      `;

      const rafflePromise = request<RaffleQueryResult>(endpoint, raffleQuery, { poolId });

      const promises: [Promise<RaffleQueryResult>, Promise<PlayerStatsQueryResult | null>] = [rafflePromise, Promise.resolve(null)];
      if (userAddress) {
        const playerId = `${userAddress.toLowerCase()}-${poolId}`;
        promises[1] = request<PlayerStatsQueryResult>(endpoint, playerStatsQuery, { playerId });
      }

      const [raffleResult, playerStatsResult] = await Promise.all(promises);

      if (!raffleResult.raffle) {
        return null;
      }

      const playerStats: PlayerRaffleStatsType = playerStatsResult?.playerRaffleStats ?
        {
            ...playerStatsResult.playerRaffleStats,
            winChance: '0', // You might want to calculate this value
        } : {
        totalDepositedInRaffle: '0',
        weightedTicketsInRaffle: '0',
        winChance: '0',
      };

      const activities: RecentActivity[] = raffleResult.raffle.activities.map((act) => ({
        player: act.player.id,
        amount: act.amount,
        timestamp: act.timestamp,
        transactionHash: act.id.split('-')[0],
      }));

      const result: RaffleDetailsType = {
        ...raffleResult.raffle,
        status: raffleResult.raffle.status as RaffleStatus,
        totalPrizePool: raffleResult.raffle.totalPrizePool,
        userTotalDeposit: playerStats.totalDepositedInRaffle,
        activities,
      };

      return result;
    },
    enabled: !!poolId,
  });
};

export default useGetRaffleDetails;
