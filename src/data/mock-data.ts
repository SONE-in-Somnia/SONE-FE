// src/data/mock-data.ts
import { PoolType } from "@/types/raffle";
import { RaffleDetailsType } from "@/types/raffle";

const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;

// Mock data for the list of all raffles (`/raffle` page)
export const mockPools: PoolType[] = [
    {
        id: '1',
        name: 'Super Mega Ultra Raffle',
        symbol: 'STT',
        status: 'INPROCESS',
        poolAddress: '0x1234567890123456789012345678901234567890',
        tokenAddress: '0xabcdeFabcdeFabcdeFabcdeFabcdeFabcdeFabcdeF',
        startTime: Math.floor((now.getTime() - 1 * oneDay) / 1000).toString(),
        drawTime: Math.floor((now.getTime() + 3 * oneDay) / 1000).toString(),
        depositDeadline: Math.floor((now.getTime() + 2 * oneDay) / 1000).toString(),
        totalDeposits: '125',
        participantCount: 50,
        winner: '0x1111111111111111111111111111111111111111',
        activities: [
            {
              user: "0x_Alice",
              amount: "100.00 STT",
              timestamp: (Math.floor(Date.now() / 1000) - 3600).toString(),
              transactionHash: "0xabc123...",
            },
            {
              user: "0x_Bob",
              amount: "250.00",
              timestamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
              transactionHash: "0xdef456...",
            },
        ],
    },
    {
        id: '2',
        name: 'Early Bird Special',
        symbol: 'ETH',
        status: 'INPROCESS',
        poolAddress: '0x2345678901234567890123456789012345678901',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        startTime: Math.floor((now.getTime() - 11 * oneDay) / 1000).toString(),
        drawTime: Math.floor((now.getTime() + 10 * oneDay) / 1000).toString(),
        depositDeadline: Math.floor((now.getTime() + 9 * oneDay) / 1000).toString(),
        totalDeposits: '50.0',
        participantCount: 120,
        winner: '0x2222222222222222222222222222222222222222',
        activities: [
            {
              user: "0x_Charlie",
              amount: "500.00",
              timestamp: (Math.floor(Date.now() / 1000) - 86400 * 6).toString(),
              transactionHash: "0xghi789...",
            },
            {
              user: "0x_David",
              amount: "1500.00",
              timestamp: (Math.floor(Date.now() / 1000) - 86400 * 7).toString(),
              transactionHash: "0xjkl012...",
            },
        ],
    },
    {
        id: '3',
        name: 'Community Giveaway (Completed)',
        symbol: 'USDC',
        status: 'COMPLETED',
        poolAddress: '0x3456789012345678901234567890123456789012',
        tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        startTime: Math.floor((now.getTime() - 7 * oneDay) / 1000).toString(),
        drawTime: Math.floor((now.getTime() - 5 * oneDay) / 1000).toString(),
        depositDeadline: Math.floor((now.getTime() - 6 * oneDay) / 1000).toString(),
        totalDeposits: '2500',
        participantCount: 350,
        winner: '0x9876543210987654321098765432109876543210',
        activities: [
            {
              user: "0x_Eve",
              amount: "750.00",
              timestamp: (Math.floor(Date.now() / 1000) - 86400 * 8).toString(),
              transactionHash: "0xmno345...",
            },
            {
              user: "0x_Frank",
              amount: "1250.00",
              timestamp: (Math.floor(Date.now() / 1000) - 86400 * 9).toString(),
              transactionHash: "0xpqr678...",
            },
        ],
    },
];

// Mock data for a single, detailed raffle view (`/raffle/[id]` page)
export const mockRaffleDetails: RaffleDetailsType = {
  ...mockPools[0], // Use the first active raffle as a base
  totalPrize: "15000.00",
  userTotalDeposit: "500.00",
  activities: [
    {
      user: "0x_Alice",
      amount: "100.00",
      timestamp: (Math.floor(Date.now() / 1000) - 3600).toString(),
      transactionHash: "0xabc123...",
    },
    {
      user: "0x_Bob",
      amount: "250.00",
      timestamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
      transactionHash: "0xdef456...",
    },
    {
      user: "0x_Bob",
      amount: "250.00",
      timestamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
      transactionHash: "0xdef456...",
    },
    {
      user: "0x_Bob",
      amount: "250.00",
      timestamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
      transactionHash: "0xdef456...",
    },
  ],
};

// A separate mock for a completed raffle to test the winner display
export const mockCompletedRaffleDetails: RaffleDetailsType = {
  ...mockPools[2], // Use the first completed raffle as a base
  totalPrize: "275000.00",
  userTotalDeposit: "1000.00",
  activities: [
    {
      user: "0x_Charlie",
      amount: "500.00",
      timestamp: (Math.floor(Date.now() / 1000) - 86400 * 6).toString(),
      transactionHash: "0xghi789...",
    },
    {
      user: "0x_David",
      amount: "1500.00",
      timestamp: (Math.floor(Date.now() / 1000) - 86400 * 7).toString(),
      transactionHash: "0xjkl012...",
    },
  ],
};
