// src/api/useGetKuroHistory.ts
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { YoloABIMultiToken } from "@/abi/YoloABI";
import { Round, RoundHistoryResponse, RoundStatus } from "@/types/round";
import { getProvider } from "@/utils/ethers";

const KURO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`;

const getStatusText = (status: number): RoundStatus => {
  switch (status) {
    case 0: return 'None';
    case 1: return 'Open';
    case 2: return 'Drawn';
    case 3: return 'Drawn';
    case 4: return 'Cancelled';
    default: return 'None';
  }
};

const getKuroHistory = async (body: {
  page?: number;
  type: "youWin" | "all";
  limit?: number;
  address?: string;
}): Promise<RoundHistoryResponse<Round>> => {
  const provider = getProvider();
  const contract = new ethers.Contract(KURO_CONTRACT_ADDRESS, YoloABIMultiToken, provider);

  const currentRoundId = await contract.currentRoundId();
  const rounds: Round[] = [];

  const limit = body.limit || 10;
  const page = body.page || 1;
  const startRound = currentRoundId - (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const roundId = startRound - i;
    if (roundId < 0) break;

    const roundData = await contract.getRoundData(roundId, ethers.ZeroAddress);
    const round: Round = {
      roundId: Number(roundId),
      status: getStatusText(roundData[0].status),
      numberOfParticipants: Number(roundData[0].numberOfParticipants),
      totalValue: roundData[0].totalValue.toString(),
      winner: roundData[0].winner,
      participants: [],
      endTime: Number(roundData[0].endTime),
      completedAt: new Date(Number(roundData[0].drawnAt) * 1000),
      winnerClaimed: false,
      txClaimed: '',
    };
    rounds.push(round);
  }

  return {
    data: rounds,
    message: "Success",
    page,
    size: limit,
    success: true,
    total: Number(currentRoundId),
  };
};

export const useGetKuroHistory = (body: {
  page?: number;
  type: "youWin" | "all";
  limit?: number;
  address?: string;
}) => {
  return useQuery({
    queryKey: ["kuro-history", body],
    queryFn: () => getKuroHistory(body),
  });
};