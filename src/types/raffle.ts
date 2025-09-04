import { Player, PlayerRaffleStats } from './../../subgraph/generated/schema';
// src/types/raffle.ts

import { Address } from 'viem';

export enum RaffleStatus { 
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export interface PrizePool {
  name: string;
  symbol: string;
  prizePoolAddress: string; // Ethereum address as a string
  tokenAddress: string;     // Ethereum address as a string
  yieldProtocolAddress: string; // Ethereum address as a string
  depositionDeadline: number;   // uint256 as a number (or BigNumber if using ethers.js)
  withdrawalTime: number;       // uint256 as a number (or BigNumber if using ethers.js)
  // Additional fields from the current useGetPoolsRPC that might be needed
  totalDeposits: string;
  participantCount: number;
  winner: string;
}

export type PrizePoolList = PrizePool[];

export interface PrizePoolData {
  name: string; // Added name
  symbol: string; // Added symbol
  token: Address; // Changed to Address
  depositDeadline: number; // Unix timestamp for deposit cutoff
  drawTime: number; // Unix timestamp for withdrawal start
  totalDeposits: string; // Total tokens deposited (in wei)
  totalWeightedTickets: string; // Sum of all weighted tickets
  totalInterest: string; // Interest earned from yield protocol (in wei)
  yieldProtocolAddress: Address; // Changed to Address
  winner: Address; // Changed to Address
  userDeposit: string; // User's deposited amount (in wei)
  userWeightedTickets: string; // User's weighted tickets
  isUserWinner: boolean; // Whether the user is the winner
  userWinRate: number; // User's win probability in parts per million
  participantCount: number; // Number of unique depositors
  isLoading: boolean; // Whether data is being fetched
  error: string | null; // Error message if fetching fails
}

export type RecentActivity = {
    player: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

export type PlayerRaffleStatsType = {
    totalDepositedInRaffle: string;
    weightedTicketsInRaffle: string;
    winChance: string;
}

