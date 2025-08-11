"use client";
import Card from "@/components/card";
import { useKuro } from "@/context/KuroContext";
import HistoryItem from "./HistoryItem";
import { useAppKitAccount } from "@reown/appkit/react";

import { useEffect, useState } from "react";
import { Round } from "@/types/round";
import Window from "@/views/home-v2/components/Window";
import { RetroButton } from "@/components/RetroButton";
import { DialogClose } from "@/components/ui/dialog";

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
    refetchHistories(1, 500, activeTab);
  }, [address, activeTab]);

  const titleComponent = (
    <div className="flex w-full items-center justify-between">
      <h2 className="font-pixel-operator-mono text-[16px] font-bold">
        ROUND HISTORY
      </h2>
      <DialogClose asChild>
        <RetroButton className="px-2 py-0 text-sm">&#10006;</RetroButton>
      </DialogClose>
    </div>
  );

  return (
    <div className="flex h-[600px] items-center justify-center">
      <Window
        title={titleComponent}
        headerClassName="bg-green-700"
        className="w-[1024px]"
      >
        <div className="h-full w-full p-4">
          <div className="sticky top-0 z-10 flex items-center justify-between text-sm">
            <div className="overflow-hidden p-1">
              <div className="relative flex h-full gap-2">
                <div
                  className={`absolute top-0 h-full w-1/2 transition-all ${activeTab == "all" ? "left-0" : "left-1/2"}`}
                ></div>
                <RetroButton
                  onClick={() => setActiveTab("all")}
                  className="relative grid flex-1 cursor-pointer place-items-center whitespace-nowrap py-2"
                >
                  All
                </RetroButton>
                <RetroButton
                  onClick={() => setActiveTab("youWin")}
                  className="relative z-[1] grid flex-1 cursor-pointer place-items-center whitespace-nowrap py-2"
                >
                  Your Win
                </RetroButton>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
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
      </Window>
    </div>
  );
};

export default RoundHistory;
