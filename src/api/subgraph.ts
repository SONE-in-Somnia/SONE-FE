// src/api/subgraph.ts
import { GraphQLClient, gql } from 'graphql-request';
import { Raffle } from '@/types/raffle';

// --- MOCK DATA IMPLEMENTATION ---
// The original subgraph endpoint is unavailable.
// The following functions return mock data to allow for frontend development.
// TODO: Remove this mock implementation and restore the original code when the subgraph is running.

// const mockRaffles: Raffle[] = [
//   {
//     id: 1,
//     title: 'Super Mega Raffle',
//     prize: '1,000,000 STT',
//     endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//     ticketsSold: 1250,
//     ticketPrice: 10,
//     prizePool: 12500,
//     status: 'in-progress',
//   },
//   {
//     id: 2,
//     title: 'Early Bird Special',
//     prize: 'Exclusive NFT',
//     endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
//     ticketsSold: 500,
//     ticketPrice: 5,
//     prizePool: 2500,
//     status: 'in-progress',
//   },
//   {
//     id: 3,
//     title: 'Community Giveaway',
//     prize: '500 STT',
//     endsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//     ticketsSold: 2000,
//     ticketPrice: 2,
//     prizePool: 4000,
//     status: 'completed',
//   },
// ];


// export const getRafflesFromSubgraph = async (): Promise<Raffle[]> => {
//   console.warn("Returning mock raffle data because the subgraph is unavailable.");
//   return Promise.resolve(mockRaffles);
// };

// export const getRaffleByIdFromSubgraph = async (id: string): Promise<Raffle | null> => {
//   console.warn(`Returning mock raffle data for ID ${id} because the subgraph is unavailable.`);
//   const raffleId = parseInt(id, 10);
//   const raffle = mockRaffles.find(r => r.id === raffleId) || null;
//   return Promise.resolve(raffle);
// };

/*
// --- ORIGINAL CODE ---
// const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/sone/raffle';

// const client = new GraphQLClient(SUBGRAPH_URL);

// export const getRafflesFromSubgraph = async (): Promise<Raffle[]> => {
//   const query = gql`
//     query {
//       raffles {
//         id
//         title
//         prize
//         endsAt
//         ticketsSold
//         ticketPrice
//         prizePool
//         status
//       }
//     }
//   `;

//   const data = await client.request<{ raffles: Raffle[] }>(query);
//   return data.raffles;
// };

// export const getRaffleByIdFromSubgraph = async (id: string): Promise<Raffle | null> => {
//   const query = gql`
//     query GetRaffle($id: ID!) {
//       raffle(id: $id) {
//         id
//         title
//         prize
//         endsAt
//         ticketsSold
//         ticketPrice
//         prizePool
//         status
//         winner {
//           id
//           address
//         }
//         deposits {
//           id
//           player {
//             id
//             address
//           }
//           amount
//           timestamp
//         }
//       }
//     }
//   `;

//   const data = await client.request<{ raffle: Raffle | null }>(query, { id });
//   return data.raffle;
// };
*/
