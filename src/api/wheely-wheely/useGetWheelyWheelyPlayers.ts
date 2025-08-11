"use client";

import { useReadContract } from "wagmi";
import { wheelyWheelyABI } from "@/abi/WheelyWheelyABI";

// This would come from a config file or environment variable
const WHEELY_WHEELY_CONTRACT_ADDRESS = "0x..._MOCK_ADDRESS_...";

export const useGetWheelyWheelyPlayers = () => {
  const { data, error, isLoading, refetch } = useReadContract({
    address: WHEELY_WHEELY_CONTRACT_ADDRESS,
    abi: wheelyWheelyABI,
    functionName: "getPlayers",
  });

  return {
    players: data,
    error,
    isLoading,
    refetch,
  };
};