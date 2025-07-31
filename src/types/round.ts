export type RoundStatus = 'None' | 'Open' | 'Drawn' | 'Cancelled';

export interface Player {
  address: string;
  deposit: string;
  entries: number;
  winrate: number;
}

export interface Round {
    _id?: string;
    roundId: number;
    status: RoundStatus;
    cutoffTime?: number;
    numberOfParticipants: number;
    totalValue: string;
    winner: string;
    participants: KuroParticipant[];
    completedAt?: Date;
    endTime: number;
    createdAt?: Date;
    updatedAt?: Date;
    winnerClaimed: boolean;
    txClaimed: string;
    kuroContractAddress?: string;
} 

export interface RoundHistoryResponse<T> {
    data: T[];
    message: string;
    page: number;
    size: number;
    success: boolean;
    total: number;
}

export interface KinpuParticipant {
    address: string;
    deposit: bigint;
    roomNumber: number;
  }

  export interface KuroParticipant {
    address: string;
    deposits: {
      amount: string;
      tokenAddress: `0x${string}`;
      _id: string,
    }[];
    _id: string;
  }
  
  export interface KinpuData {
    roundId: number;
    status: number;
    startTime: number;
    endTime: number;
    drawnAt: number;
    numberOfParticipants: number;
    winner: string;
    totalValue: string;
    totalEntries: string;
    participants: KinpuParticipant[];
    isShowingWinner: boolean;
    remainingTime?: number;
    isHistoricalRound?: boolean;
    currentRoundId?: string;
    carryOverReward?: string;
    error?: string;
  }
  
  export interface KinpuWinnerAnnounced {
    drawnAt: number;
    participants: KinpuParticipant[];
    roundId: number;
    safeRoom: number;
    totalValue: string;
    winners: KinpuWinner[];
  }
  
  export interface KinpuWinner {
    address: string;
    claimed: boolean;
    claimedAt: number;
    deposit: string;
    txHash: string;
    _id: string;
  }

export interface KinpuRoundHistory {
    _id: string;
    roundId: number;
    __v: number;
    allWinnersClaimed: boolean;
    createdAt: Date;
    drawnAt: number;
    endTime: number;
    numberOfPlayers: number;
    participants: KinpuParticipant[];
    protocolFeeOwed: string;
    safeRoom: number;
    startTime: number;
    status: number;
    totalEntries: string;
    totalValue: string;
    updatedAt: Date;
    winners: KinpuWinner[];
    carryOverReward: string;
}

export interface KuroWinnerAnnounced {
  data: {
    drawnAt: number;
    participants: KuroParticipant[];
    roundId: number;
    totalValue: string;
    winner: string;
  }
}

export interface SupportedTokenInfo {
  address: string;
  isSupported: boolean;
  decimals: number;
  isActive: boolean;
  minDeposit: bigint;
  ratio: bigint;
  symbol?: string;
  name?: string;
  description?: string;
  balance?: bigint;
  allowance?: bigint;
}

export interface JackpotRound {
    jackPotId: string;
    roundId: number;
    winner: string;
    totalPool: BigInt;
    txTransferred: string;
    status: "Processing" | "Ended";
    endTime: string;
    createdAt: Date;
    updatedAt: Date;
}