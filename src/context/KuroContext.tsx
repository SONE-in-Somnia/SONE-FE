"use client";

import { KuroData, KuroParticipant } from "@/types/round";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { toast } from "react-toastify";
import { parseEther } from "viem";

export enum PoolStatus {
  WAIT_FOR_FIST_DEPOSIT,
  DEPOSIT_IN_PROGRESS,
  DRAWING_WINNER,
  SPINNING,
  SHOWING_WINNER,
  WAITING_FOR_NEXT_ROUND,
}

export enum TimeEnum {
  _1MIN = 60000,
  _5SECS = 5000,
  _9SECS = 9000,
  _15SECS = 15000,
  _1DAY = 86400000,
}

export interface HistoryData {
  data: any[];
  total: number;
}

interface IKuroContext {
  kuroData: KuroData | null;
  winnerData: KuroParticipant | null;
  poolStatus: PoolStatus;
  setPoolStatus: Dispatch<SetStateAction<PoolStatus>>;
  addEntry: (address: string, amount: string) => Promise<string | null>;
  updateGameData: (data: Partial<KuroData>) => void;
  refetchCounter: number;
  triggerRefetch: () => void;
  registerKuroListener: () => void;
  unRegisterKuroListener: () => void;
  handleClaimPrizes: (
    roundId: number,
    entries: any[],
    contractAddress: string,
  ) => Promise<void>;
  refetchHistories: (page: number, limit: number, type: string) => void;
  isFetchingKuroHistory: boolean;
  allHistories: HistoryData;
  myWinHistories: HistoryData;
  handleWithdraw: (
    roundId: number,
    deposits: bigint[],
    contractAddress: string,
  ) => Promise<void>;
  refetchJackpotHistories: (page: number, limit: number, type: string) => void;
  isFetchingJackpotHistory: boolean;
  allJackpotHistories: HistoryData;
  myJackpotHistories: HistoryData;
}

export const KuroContext = createContext<IKuroContext>({
  kuroData: null,
  winnerData: null,
  poolStatus: PoolStatus.WAIT_FOR_FIST_DEPOSIT,
  setPoolStatus: () => {},
  addEntry: async () => null,
  updateGameData: () => {},
  refetchCounter: 0,
  triggerRefetch: () => {},
  registerKuroListener: () => {},
  unRegisterKuroListener: () => {},
  handleClaimPrizes: async () => {},
  refetchHistories: () => {},
  isFetchingKuroHistory: false,
  allHistories: { data: [], total: 0 },
  myWinHistories: { data: [], total: 0 },
  handleWithdraw: async () => {},
  refetchJackpotHistories: () => {},
  isFetchingJackpotHistory: false,
  allJackpotHistories: { data: [], total: 0 },
  myJackpotHistories: { data: [], total: 0 },
});

export const KuroProvider = ({ children }: { children: ReactNode }) => {
  const [kuroData, setKuroData] = useState<KuroData | null>({
    roundId: 1235,
    participants: [],
    totalValue: "0",
    startTime: 0,
    endTime: new Date().getTime() + 30 * 60 * 1000 + 45 * 1000,
  });
  const [winnerData, setWinnerData] = useState<KuroParticipant | null>(null);
  const [poolStatus, setPoolStatus] = useState<PoolStatus>(
    PoolStatus.DEPOSIT_IN_PROGRESS,
  );
  const [refetchCounter, setRefetchCounter] = useState(0);
  const [isFetchingKuroHistory, setIsFetchingKuroHistory] = useState(false);
  const [allHistories, setAllHistories] = useState<HistoryData>({
    data: [],
    total: 0,
  });
  const [myWinHistories, setMyWinHistories] = useState<HistoryData>({
    data: [],
    total: 0,
  });
  const [isFetchingJackpotHistory, setIsFetchingJackpotHistory] =
    useState(false);
  const [allJackpotHistories, setAllJackpotHistories] = useState<HistoryData>({
    data: [],
    total: 0,
  });
  const [myJackpotHistories, setMyJackpotHistories] = useState<HistoryData>({
    data: [],
    total: 0,
  });

  const triggerRefetch = () => setRefetchCounter((prev) => prev + 1);

  const updateGameData = (data: Partial<KuroData>) => {
    setKuroData((prevData) => ({
      ...(prevData as KuroData),
      ...data,
    }));
  };

  const registerKuroListener = () => {
    console.log("Kuro listener registered (placeholder)");
  };

  const unRegisterKuroListener = () => {
    console.log("Kuro listener unregistered (placeholder)");
  };

  const handleClaimPrizes = async (
    roundId: number,
    entries: any[],
    contractAddress: string,
  ) => {
    console.log(
      `Claiming prizes for round ${roundId} at ${contractAddress} with entries:`,
      entries,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleWithdraw = async (
    roundId: number,
    deposits: bigint[],
    contractAddress: string,
  ) => {
    console.log(
      `Withdrawing from round ${roundId} at ${contractAddress} with deposits:`,
      deposits,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const refetchHistories = (page: number, limit: number, type: string) => {
    console.log(
      `Refetching histories for ${type} page ${page} limit ${limit} (placeholder)`,
    );
    setIsFetchingKuroHistory(true);
    setTimeout(() => {
      if (type === "all") {
        setAllHistories({ data: [], total: 0 }); // Placeholder for new data
      } else {
        setMyWinHistories({ data: [], total: 0 }); // Placeholder for new data
      }
      setIsFetchingKuroHistory(false);
    }, 1000);
  };

  const refetchJackpotHistories = (
    page: number,
    limit: number,
    type: string,
  ) => {
    console.log(
      `Refetching jackpot histories for ${type} page ${page} limit ${limit} (placeholder)`,
    );
    setIsFetchingJackpotHistory(true);
    setTimeout(() => {
      if (type === "all") {
        setAllJackpotHistories({ data: [], total: 0 }); // Placeholder
      } else {
        setMyJackpotHistories({ data: [], total: 0 }); // Placeholder
      }
      setIsFetchingJackpotHistory(false);
    }, 1000);
  };

  const addEntry = async (
    address: string,
    amount: string,
  ): Promise<string | null> => {
    console.log(`Simulating deposit of ${amount} for ${address}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const amountWei = parseEther(amount);

      setKuroData((prevData) => {
        if (!prevData) return null;

        const playerIndex = prevData.participants.findIndex(
          (p) => p.address.toLowerCase() === address.toLowerCase(),
        );

        let newParticipants;

        if (playerIndex > -1) {
          // Player exists, create a new participants array with the updated player
          newParticipants = prevData.participants.map((p, index) => {
            if (index === playerIndex) {
              return {
                ...p,
                deposits: [
                  ...p.deposits,
                  {
                    amount: amountWei.toString(),
                    tokenAddress:
                      "0x0000000000000000000000000000000000000000" as `0x${string}`,
                    _id: `deposit-${Date.now()}`,
                  },
                ],
              };
            }
            return p;
          });
        } else {
          // New player, create a new participants array with the new player added
          newParticipants = [
            ...prevData.participants,
            {
              address,
              deposits: [
                {
                  amount: amountWei.toString(),
                  tokenAddress:
                    "0x0000000000000000000000000000000000000000" as `0x${string}`,
                  _id: `deposit-${Date.now()}`,
                },
              ],
              _id: `participant-${Date.now()}`,
            },
          ];
        }

        const newTotalValue = (
          BigInt(prevData.totalValue) + amountWei
        ).toString();

        return {
          ...prevData,
          participants: newParticipants,
          totalValue: newTotalValue,
        };
      });

      const mockHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      toast.success("Deposit successful!");
      return mockHash;
    } catch (e) {
      toast.error("Deposit failed!");
      return null;
    }
  };

  return (
    <KuroContext.Provider
      value={{
        kuroData,
        winnerData,
        poolStatus,
        setPoolStatus,
        addEntry,
        updateGameData,
        refetchCounter,
        triggerRefetch,
        registerKuroListener,
        unRegisterKuroListener,
        handleClaimPrizes,
        refetchHistories,
        isFetchingKuroHistory,
        allHistories,
        myWinHistories,
        handleWithdraw,
        refetchJackpotHistories,
        isFetchingJackpotHistory,
        allJackpotHistories,
        myJackpotHistories,
      }}
    >
      {children}
    </KuroContext.Provider>
  );
};

export const useKuro = () => useContext(KuroContext);
