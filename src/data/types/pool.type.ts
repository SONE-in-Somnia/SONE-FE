type PoolType = {
    id: string,
    depositDeadline: string,
    name: string,
    poolAddress: `0x${string}`,
    symbol: string,
    drawTime: string,
    tokenAddress: string,
    status: "INPROCESS" | "COMPLETED" | "WITHDRAW"
    totalDeposits: string
    winner: string,
    
}

type RecentActivity = {
    user: string;
    amount: string;
    timestamp: string;
    transactionHash: string;
}

type PlayerType = {
    address: string,
    winrate: string,
    totalDeposits: string,
}