"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  JackpotRound,
  KuroParticipant,
  KuroWinnerAnnounced,
  Round,
  RoundHistoryResponse,
} from "@/types/round";
import { useGetKuroHistory } from "@/api/useGetKuroHistory";
import { YoloABI, YoloABIMultiToken } from "@/abi/YoloABI";
import { useWriteContract } from "wagmi";
import useClaimKuroRound from "@/api/useClaimKuroRound";
import { useAuth } from "./AuthContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { useGetJackpotHistory } from "@/api/useGetJackpotHistory";
import { useSocket } from "./SocketContext";

export enum TimeEnum {
  _5SECS = 5 * 1000,
  _9SECS = 9 * 1000,
  _10SECS = 10 * 1000,
  _15SECS = 15 * 1000,
  _30SECS = 30 * 1000,
  _10MINS = 10 * 60 * 1000,
  _15MINS = 15 * 60 * 1000,
  _20MINS = 20 * 60 * 1000,
  _30MINS = 30 * 60 * 1000,
  _1HOUR = 60 * 60 * 1000,
  _1DAY = 60 * 60 * 24 * 1000,
}

export enum PoolStatus {
  WAITING_FOR_NEXT_ROUND = "WAITING FOR NEXT ROUND",
  WAIT_FOR_FIST_DEPOSIT = "WAIT FOR FIRST DEPOSIT",
  DEPOSIT_IN_PROGRESS = "DEPOSIT IN PROGRESS",
  DRAWING_WINNER = "DRAWING WINNER",
  SPINNING = "SPINNING",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
  SHOWING_WINNER = "SHOWING WINNER",
}

export enum KuroStatus {
  NONE = 0,
  OPEN = 1,
  DRAWING = 2,
  DRAWN = 3,
  CANCELLED = 4,
}

// Định nghĩa các kiểu dữ liệu
export interface Participant {
  address: string;
  deposit: string;
}

export interface KuroData {
  roundId: string;
  status: number;
  startTime: number;
  endTime: number;
  drawnAt: number;
  numberOfParticipants: number;
  winner: string;
  totalValue: string;
  totalEntries: string;
  participants: KuroParticipant[];
  remainingTime?: number;
  isHistoricalRound?: boolean;
  currentRoundId?: string;
  error?: string;
}

export interface WinnerData {
  roundId: number;
  winner: string;
  drawnAt: number;
  totalValue: string;
  participants: KuroParticipant[];
}

interface KuroContextProps {
  kuroData: KuroData | null;
  winnerData: WinnerData | null;
  formatEther: (value: string) => string;
  handleClaimPrizes: (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string,
  ) => Promise<void>;
  handleWithdraw: (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string,
  ) => Promise<void>;
  poolStatus: PoolStatus;
  setPoolStatus: (status: PoolStatus) => void;

  allHistories: RoundHistoryResponse<Round> | null;
  myWinHistories: RoundHistoryResponse<Round> | null;
  refetchHistories: (
    page?: number,
    limit?: number,
    type?: "all" | "youWin",
  ) => Promise<void>;
  isFetchingKuroHistory: boolean;
  registerKuroListener: () => void;
  unRegisterKuroListener: () => void;
}

interface KuroProviderProps {
  children: ReactNode;
}

// Tạo context
const KuroContext = createContext<KuroContextProps | undefined>(undefined);

// Format Wei thành Ether
const formatEther = (value: string): string => {
  if (!value) return "0";

  try {
    const wei = BigInt(value);
    const divisor = BigInt(10 ** 18);
    const integerPart = wei / divisor;
    const fractionalPart = wei % divisor;

    // Định dạng phần thập phân
    let fractionalStr = fractionalPart.toString().padStart(18, "0");
    // Loại bỏ số 0 ở cuối
    fractionalStr = fractionalStr.replace(/0+$/, "");

    if (fractionalStr) {
      return `${integerPart}.${fractionalStr}`;
    } else {
      return `${integerPart}`;
    }
  } catch (error) {
    console.error("Error formatting ether value:", error);
    return "0";
  }
};

export const KuroProvider: React.FC<KuroProviderProps> = ({ children }) => {
  const { address } = useAppKitAccount();

  const { isSyncMessage, signMessageWithSign, nativeBalance } = useAuth();
  const [kuroData, setKuroData] = useState<KuroData | null>(null);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [allHistories, setAllHistories] =
    useState<RoundHistoryResponse<Round> | null>(null);
  const [poolStatus, setPoolStatus] = useState(
    PoolStatus.WAIT_FOR_FIST_DEPOSIT,
  );
  const [myWinHistories, setMyWinHistories] =
    useState<RoundHistoryResponse<Round> | null>(null);
  const [allJackpotHistories, setAllJackpotHistories] =
    useState<RoundHistoryResponse<JackpotRound> | null>(null);
  const [myJackpotHistories, setMyJackpotHistories] =
    useState<RoundHistoryResponse<JackpotRound> | null>(null);
  const { socket, registerSocketListener, unRegisterSocketListener } =
    useSocket();

  const { updateSupportedTokens } = useAuth();

  const { writeContractAsync, isPending: isDepositing } = useWriteContract();
  const { writeContractAsync: claimKuroMultiToken, isPending: isClaiming } =
    useWriteContract();
  const { writeContractAsync: withdrawMultiToken, isPending: isWithdrawing } =
    useWriteContract();

  const _claimKuroRound = useClaimKuroRound();

  const { mutateAsync: mutateAsyncHistory, isPending: isFetchingKuroHistory } =
    useGetKuroHistory();
  const {
    mutateAsync: mutateAsyncJackpotHistory,
    isPending: isFetchingJackpotHistory,
  } = useGetJackpotHistory();

  const handleClaimPrizes = async (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string,
  ) => {
    if (userDepositIndices.length == 0) {
      toast.error("No prizes to claim");
      return;
    }

    if (!isSyncMessage) {
      toast.info("You need to sign first before claiming prizes");
      await signMessageWithSign();
    }

    try {
      let res;

      if (kuroContractAddress) {
        // new contract address
        if (
          kuroContractAddress.toLowerCase() ===
          process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS?.toLowerCase()
        ) {
          res = claimKuroMultiToken({
            abi: YoloABIMultiToken,
            address: process.env
              .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
            functionName: "claimPrizes",
            args: [
              {
                roundId: BigInt(roundId),
                depositIndices: userDepositIndices.map((amount, index) =>
                  BigInt(index),
                ),
              },
            ],
          });
        } else {
          toast.error("Invalid contract address");
          return;
        }
      } else {
        // old contract address
        res = writeContractAsync({
          abi: YoloABI,
          address: process.env.NEXT_PUBLIC_KURO_ADDRESS as `0x${string}`,
          functionName: "claimPrizes",
          args: [
            {
              roundId: BigInt(roundId),
              depositIndices: userDepositIndices.map((amount, index) =>
                BigInt(index),
              ),
            },
          ],
        });
      }

      toast
        .promise(res, {
          pending: "Claim processing..",
          success: "Claim Success. 👌",
          error: "Claim failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();

          _claimKuroRound
            .mutateAsync({
              roundId: roundId,
              txHash: txHash,
            })
            .then(() => {
              refetchHistories();
            });
        });
    } catch (error) {
      console.error("Error claiming prizes:", error);
      toast.error("Failed to claim prizes");
    }
  };

  const handleWithdraw = async (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string,
  ) => {
    if (!isSyncMessage) {
      toast.info("You need to sign first before Withdraw prizes");
      await signMessageWithSign();
    }

    try {
      let res;

      if (kuroContractAddress) {
        // new contract address
        if (
          kuroContractAddress.toLowerCase() ===
          process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS?.toLowerCase()
        ) {
          const specialRound = [4855, 5022, 5062];
          console.log(roundId);

          const getUserDepositIndicesSpecialRound = (): bigint[] => {
            const _userDepositIndices: bigint[] = [];
            for (let i = 0; i < userDepositIndices.length; i++) {
              if (i !== 0) {
                _userDepositIndices.push(BigInt(i));
              }
            }
            return _userDepositIndices;
          };

          res = withdrawMultiToken({
            abi: YoloABIMultiToken,
            address: process.env
              .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
            functionName: "withdrawDeposits",
            args: [
              {
                roundId: BigInt(roundId),
                depositIndices: specialRound.includes(Number(roundId))
                  ? getUserDepositIndicesSpecialRound()
                  : userDepositIndices.map((amount, index) => {
                      return BigInt(index);
                    }),
              },
            ],
          });
        } else {
          toast.error("Invalid contract address");
          return;
        }
      } else {
        // old contract address
        res = writeContractAsync({
          abi: YoloABI,
          address: process.env.NEXT_PUBLIC_KURO_ADDRESS as `0x${string}`,
          functionName: "withdrawDeposits",
          args: [
            {
              roundId: BigInt(roundId),
              depositIndices: userDepositIndices.map((amount, index) =>
                BigInt(index),
              ),
            },
          ],
        });
      }

      toast
        .promise(res, {
          pending: "Withdraw processing..",
          success: "Withdraw Success. 👌",
          error: "Withdraw failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();
          _claimKuroRound
            .mutateAsync({
              roundId: roundId,
              txHash: txHash,
            })
            .then(() => {
              refetchHistories();
            });
        });
    } catch (error) {
      console.error("Error withdraw prizes:", error);
      toast.error("Failed to withdraw prizes");
    }
  };

  const refetchHistories = async (
    page?: number,
    limit?: number,
    type?: "all" | "youWin",
  ) => {
    if (type === "all" || !type) {
      const allHistoriesData = await mutateAsyncHistory({
        page: page,
        type: "all",
        limit: limit,
      });

      if (allHistoriesData.success) {
        setAllHistories(allHistoriesData);
      }
    }

    if (type === "youWin" || !type) {
      const myWinHistoriesData = await mutateAsyncHistory({
        page: page,
        type: "youWin",
        limit: limit,
        address: address,
      });

      if (myWinHistoriesData.success) {
        setMyWinHistories(myWinHistoriesData);
      }
    }
  };

  const refetchJackpotHistories = async (
    page?: number,
    limit?: number,
    type?: "all" | "youWin",
  ) => {
    if (type === "all" || !type) {
      const allJackpotHistoriesData = await mutateAsyncJackpotHistory({
        page: page,
        type: "all",
        limit: limit,
      });

      if (allJackpotHistoriesData.success) {
        setAllJackpotHistories(allJackpotHistoriesData);
      }
    }

    if (type === "youWin" || !type) {
      const myJackpotHistoriesData = await mutateAsyncJackpotHistory({
        page: page,
        type: "youWin",
        limit: limit,
        address: address,
      });

      if (myJackpotHistoriesData.success) {
        setMyJackpotHistories(myJackpotHistoriesData);
      }
    }
  };

  const handleWinnerAnnounced = useCallback(
    (eventData: KuroWinnerAnnounced) => {
      console.log("Winner announced event received:", eventData);

      const { data } = eventData;
      const roundId = Number(data.roundId);

      // Lưu thông tin người thắng
      setWinnerData({
        roundId: roundId,
        winner: data.winner,
        drawnAt: data.drawnAt,
        totalValue: data.totalValue,
        participants: data.participants || [],
      });

      setPoolStatus(PoolStatus.SPINNING);
    },
    [],
  );

  const handleKuroUpdate = useCallback(
    (data: KuroData) => {
      console.log("Received Kuro update:", data);

      // SPINNING or SHOWING_WINNER
      if (
        poolStatus === PoolStatus.SPINNING ||
        poolStatus === PoolStatus.SHOWING_WINNER
      ) {
        console.log(
          "Ignoring kuroUpdate due to SPINNING or SHOWING_WINNER state",
        );
        return;
      }

      if (data.error && data.error === "No data available") {
        // console.log(
        //   `Ignoring kuroUpdate with no data available for round ${data.roundId}`,
        // );
        // resetStates();
        return;
      } else {
        setKuroData({
          ...data,
          endTime: data.endTime - TimeEnum._5SECS / 1000,
        });

        // DRAWING
        if (
          data.startTime > 0 &&
          data.endTime > 0 &&
          data.endTime - Date.now() / 1000 < 0
        ) {
          setPoolStatus(PoolStatus.DRAWING_WINNER);
          return;
        }

        // OPEN FOR DEPOSIT
        if (data.startTime === 0 && data.endTime === 0) {
          setPoolStatus(PoolStatus.WAIT_FOR_FIST_DEPOSIT);
        }

        // DEPOSIT_IN_PROGRESS
        if (data.startTime > 0 && data.endTime > 0) {
          setPoolStatus(PoolStatus.DEPOSIT_IN_PROGRESS);
        }
      }
    },
    [poolStatus, setKuroData, setPoolStatus],
  );

  const registerKuroListener = useCallback(() => {
    if (!socket) return;

    registerSocketListener("kuroUpdate", handleKuroUpdate);
    registerSocketListener("winnerAnnounced", handleWinnerAnnounced);
  }, [socket]);

  const unRegisterKuroListener = useCallback(() => {
    if (!socket) return;

    unRegisterSocketListener("kuroUpdate", handleKuroUpdate);
    unRegisterSocketListener("winnerAnnounced", handleWinnerAnnounced);
  }, [socket]);

  useEffect(() => {
    const allHistoriesData = mutateAsyncHistory({
      page: 1,
      type: "all",
      limit: 10,
    });

    const myWinHistoriesData = mutateAsyncHistory({
      page: 1,
      type: "youWin",
      limit: 10,
    });

    allHistoriesData.then((res) => {
      if (res.success) {
        setAllHistories(res);
      }
    });

    myWinHistoriesData.then((res) => {
      if (res.success) {
        setMyWinHistories(res);
      }
    });
  }, []);

  // Context value
  const value: KuroContextProps = {
    kuroData,
    winnerData,
    formatEther,
    handleClaimPrizes,
    handleWithdraw,
    allHistories,
    myWinHistories,
    refetchHistories,
    poolStatus,
    setPoolStatus,
    isFetchingKuroHistory,
    registerKuroListener,
    unRegisterKuroListener,
  };

  return <KuroContext.Provider value={value}>{children}</KuroContext.Provider>;
};

// Hook để sử dụng context
export const useKuro = (): KuroContextProps => {
  const context = useContext(KuroContext);
  if (context === undefined) {
    throw new Error("useKuro must be used within a KuroProvider");
  }
  return context;
};
