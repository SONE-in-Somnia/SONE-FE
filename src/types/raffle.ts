
// src/types/raffle.ts

export type PoolType = {
    id: string,
    depositDeadline: string,
    name: string,
    poolAddress: `0x${string}`,
    symbol: string,
    startTime: string, // The timestamp when the raffle officially begins
    drawTime: string,
    tokenAddress: string,
    status: "INPROCESS" | "COMPLETED" | "WITHDRAW"
    totalDeposits: string
    participantCount: number; // The total number of unique participants
    winner: string,
}

export type RecentActivity = {
    user: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

export type PlayerType = {
    address: string,
    winrate: string,
    totalDeposits: string,
}

// Extends the base PoolType with additional details for the raffle page
export type RaffleDetailsType = PoolType & {
  totalPrize: string; // The total prize pool value
  userTotalDeposit: string; // The current user's total deposit in this specific raffle
  activities: RecentActivity[]; // A list of recent activities for this raffle
};
