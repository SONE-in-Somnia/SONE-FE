export type PoolType = {
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