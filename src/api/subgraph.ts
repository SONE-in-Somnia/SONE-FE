// src/api/subgraph.ts
import { GraphQLClient, gql } from 'graphql-request';
import { Raffle } from '@/types/raffle';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/sone/raffle';

const client = new GraphQLClient(SUBGRAPH_URL);

export const getRafflesFromSubgraph = async (): Promise<Raffle[]> => {
  const query = gql`
    query {
      raffles {
        id
        title
        prize
        endsAt
        ticketsSold
        ticketPrice
        prizePool
        status
      }
    }
  `;

  const data = await client.request<{ raffles: Raffle[] }>(query);
  return data.raffles;
};

export const getRaffleByIdFromSubgraph = async (id: string): Promise<Raffle | null> => {
  const query = gql`
    query GetRaffle($id: ID!) {
      raffle(id: $id) {
        id
        title
        prize
        endsAt
        ticketsSold
        ticketPrice
        prizePool
        status
        winner {
          id
          address
        }
        deposits {
          id
          player {
            id
            address
          }
          amount
          timestamp
        }
      }
    }
  `;

  const data = await client.request<{ raffle: Raffle | null }>(query, { id });
  return data.raffle;
};
