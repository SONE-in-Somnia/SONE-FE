"use client";
import {
  KuroStatus,
  PoolStatus,
  TimeEnum,
  useKuro,
} from "@/context/KuroContext";
import { RefreshCw, BadgeHelp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocket } from "@/context/SocketContext";

const RoundState = () => {
  const { kuroData, poolStatus, setPoolStatus, winnerData } = useKuro();

  const { reconnectSocket } = useSocket();

  const [remainingTime, setRemainingTime] = useState("");

  // Tính toán thời gian còn lại với useCallback
  const calculateTimeLeft = useCallback(() => {
    if (!kuroData || kuroData.endTime === 0) return;
    if (
      poolStatus === PoolStatus.CANCELED ||
      poolStatus === PoolStatus.SPINNING ||
      poolStatus === PoolStatus.WAITING_FOR_NEXT_ROUND ||
      poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT ||
      poolStatus == PoolStatus.SHOWING_WINNER
    )
      return;

    const endTimeMs = Number(kuroData.endTime) * 1000;
    const currentTime = Date.now();
    const difference = endTimeMs - currentTime;

    if (difference < 0) {
      setPoolStatus(PoolStatus.DRAWING_WINNER);
      return;
    }
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setRemainingTime(
      `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} remaining`,
    );
  }, [kuroData, setPoolStatus, poolStatus]);

  // Tính remainingTime với useMemo
  const memoizedRemainingTime = useMemo(() => {
    calculateTimeLeft();
    return remainingTime;
  }, [kuroData, calculateTimeLeft, remainingTime]);

  useEffect(() => {
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [kuroData, calculateTimeLeft]);

  return (
    <div className="mx-6 flex flex-col gap-4 py-6 pb-4 text-[#E9E9E9]">
      <div className="flex items-center justify-between font-semibold">
        <div className="flex items-center gap-2">
          <p className="">Round #{kuroData?.roundId || 0}</p>
          <Button
            onClick={reconnectSocket}
            variant="ghost"
            size="icon"
            className="p-1"
          >
            <RefreshCw size={12} />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="ml-2 cursor-pointer">
                <BadgeHelp size={16} />
              </TooltipTrigger>
              <TooltipContent className="border-gray-800 max-w-md rounded-lg border bg-black/95 p-4 text-white shadow-lg backdrop-blur-sm">
                <p className="space-y-3">
                  <span className="mb-2 block text-lg font-bold">
                    Protocol Fee
                  </span>
                  <span className="text-gray-300 mb-3 block text-sm">
                    A small contribution to keep the protocol running
                  </span>
                  <p className="text-gray-200 text-sm">
                    A small fee of 1% of total prize pool,
                    <br /> will be sent to Magic Earn protocol when
                    <br /> the winner claims their prize.
                  </p>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full bg-white/15 px-4 py-1 text-sm`}
        >
          {poolStatus === PoolStatus.WAITING_FOR_NEXT_ROUND && (
            <span className="ellipsis text-green-500">
              Setting up next round
            </span>
          )}
          {poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT && (
            <span className="text-green-500">Waiting for Deposits</span>
          )}
          {poolStatus === PoolStatus.DEPOSIT_IN_PROGRESS && (
            <span className="text-green-500">{memoizedRemainingTime}</span>
          )}
          {poolStatus === PoolStatus.DRAWING_WINNER && (
            <span className="ellipsis text-green-500">Drawing</span>
          )}
          {poolStatus === PoolStatus.SPINNING && (
            <span className="ellipsis text-green-500">Spinning</span>
          )}
          {poolStatus === PoolStatus.SHOWING_WINNER && (
            <span className="text-green-500">
              Winner is {winnerData?.winner.slice(0, 6)}...
              {winnerData?.winner.slice(-4)}
            </span>
          )}
          {poolStatus === PoolStatus.CANCELED && (
            <span className="text-red-500">Cancelled</span>
          )}
        </div>
      </div>

      <Separator />

      {/* Hiển thị thông tin người thắng nếu round đã kết thúc */}
      {/* {kuroData?.status === KuroStatus.DRAWN && kuroData?.winner && (
        <div className="mt-2 p-2 bg-blue-500/10 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🏆</span>
              <span className="font-semibold text-blue-500">Winner:</span>
            </div>
            <div className="font-mono text-blue-500">
              {kuroData?.winner}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RoundState;
