"use client";
import Card from "@/components/card";
import { useKuro } from "@/context/KuroContext";
import HistoryItem from "./HistoryItem";
import { useAppKitAccount } from "@reown/appkit/react";

import { useEffect, useState } from "react";
import { Round } from "@/types/round";

export const getTotalUserEntries = (round: Round, address: string): bigint => {
  if (!round.participants || !address) return BigInt(0);

  const user = round.participants.find(
    (player) => player.address.toLowerCase() === address.toLowerCase(),
  );
  if (!user) return BigInt(0);

  return BigInt(
    user.deposits.reduce((sum, deposit) => {
      return sum + Number(deposit.amount);
    }, 0),
  );
};

const RoundHistory = () => {
  const { refetchHistories, allHistories, myWinHistories } = useKuro();
  const { address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<"all" | "youWin">("all");

  useEffect(() => {
  }, [activeTab, address]);

  return (
    <Card className="relative flex-1 overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="sticky top-0 flex items-center justify-between text-sm">
          <p className="text-semibold text-foreground opacity-50">
            Round History
          </p>
          <div className="overflow-hidden rounded-full bg-background p-1">
            <div className="relative flex h-full">
              <div
                className={`absolute top-0 h-full w-1/2 rounded-full bg-white transition-all ${activeTab == "all" ? "left-0" : "left-1/2"}`}
              ></div>
              <div
                onClick={() => setActiveTab("all")}
                className="relative z-[1] grid w-[112px] flex-1 cursor-pointer place-items-center whitespace-nowrap rounded-full py-2 hover:bg-white/40"
              >
                All
              </div>
              <div
                onClick={() => setActiveTab("youWin")}
                className="relative z-[1] grid w-[112px] flex-1 cursor-pointer place-items-center whitespace-nowrap rounded-full py-2 hover:bg-white/40"
              >
                Your Win
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-4 overflow-auto">
          {activeTab === "all" &&
            allHistories?.data.map((history, index) => (
              <HistoryItem history={history} key={index} />
            ))}
          {activeTab === "youWin" &&
            myWinHistories?.data.map((history, index) => (
              <HistoryItem history={history} key={index} isWinner />
            ))}
        </div>
      </div>
    </Card>
  );
};

export default RoundHistory;
