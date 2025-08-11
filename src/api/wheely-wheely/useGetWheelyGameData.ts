"use client";

import { useKuro } from "@/context/KuroContext";
import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { wheelyWheelyABI } from "@/abi/WheelyWheelyABI";

const WHEELY_WHEELY_CONTRACT_ADDRESS = "0x..._MOCK_ADDRESS_...";

export const useGetWheelyGameData = () => {
  const { updateGameData, refetchCounter } = useKuro();

  const { data: players, refetch: refetchPlayers } = useReadContract({
    address: WHEELY_WHEELY_CONTRACT_ADDRESS,
    abi: wheelyWheelyABI,
    functionName: "getPlayers",
  });

  const { data: roundDetails, refetch: refetchRoundDetails } = useReadContract({
    address: WHEELY_WHEELY_CONTRACT_ADDRESS,
    abi: wheelyWheelyABI,
    functionName: "getRoundDetails",
  });

  useEffect(() => {
    if (players && roundDetails) {
      const participants = (players as any[]).map((p, index) => ({
        address: p.playerAddress,
        deposits: [
          {
            amount: p.amount.toString(),
            tokenAddress:
              "0x0000000000000000000000000000000000000000" as `0x${string}`, // Placeholder
            _id: `deposit-${index}`, // Placeholder
          },
        ],
        _id: `participant-${index}`, // Placeholder
      }));
      const totalValue = (roundDetails as any).totalPot.toString();

      updateGameData({
        participants,
        totalValue,
        roundId: Number((roundDetails as any).roundId),
        endTime: Number((roundDetails as any).endTime) * 1000,
        startTime: 0, // Add startTime to satisfy the type
      });
    }
  }, [players, roundDetails, updateGameData]);

  useEffect(() => {
    if (refetchCounter > 0) {
      refetchPlayers();
      refetchRoundDetails();
    }
  }, [refetchCounter, refetchPlayers, refetchRoundDetails]);
};