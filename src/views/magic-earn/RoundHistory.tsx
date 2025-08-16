"use client";
import Card from "@/components/card";
import { useKuro } from "@/context/KuroContext";
import HistoryItem from "./HistoryItem";
import { useAppKitAccount } from "@reown/appkit/react";
import { Search } from "lucide-react";

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
  const { refetchHistories, allHistories, myWinHistories, isFetchingKuroHistory, isErrorKuroHistory } = useKuro();
  const { address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<"all" | "youWin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistories, setFilteredHistories] = useState<Round[] | undefined>(undefined);

  useEffect(() => {
    refetchHistories(1, 500, activeTab);
  }, [activeTab, address]);

  useEffect(() => {
    setFilteredHistories(undefined);
    setSearchQuery("");
  }, [activeTab]);

  const handleSearch = () => {
    const historiesToFilter = activeTab === "all" ? allHistories?.data : myWinHistories?.data;
    if (searchQuery === "") {
        setFilteredHistories(undefined);
        return;
    }
    const filtered = historiesToFilter?.filter(history => history.roundId.toString().includes(searchQuery));
    setFilteredHistories(filtered);
  };

  const titleComponent = (
    <div className="flex w-full items-center justify-between">
        <h2 className="text-[16px] font-pixel-operator-mono font-bold">
          ROUND HISTORY
        </h2>
        <DialogClose asChild>
          <RetroButton className="px-2 py-0 text-sm">
          &#10006;
          </RetroButton>
        </DialogClose>
      </div>
    );

  const historiesToShow = filteredHistories ?? (activeTab === "all" ? allHistories?.data : myWinHistories?.data);

  const renderContent = () => {
    if (isFetchingKuroHistory) {
      return <div className="text-center">Loading...</div>;
    }

    if (isErrorKuroHistory) {
      return <div className="text-center text-red-500">Error loading history.</div>;
    }

    if (!historiesToShow || historiesToShow.length === 0) {
      return <div className="text-center">No history found.</div>;
    }

    return historiesToShow.map((history, index) => (
      <HistoryItem history={history} key={index} isWinner={activeTab === "youWin"} />
    ));
  };

  return (
    <div className="flex h-[600px] items-center justify-center">
      <Window title={titleComponent} headerClassName="bg-green-700" className="w-[1024px] ">
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search for Round..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="font-pixel-operator-mono bg-white border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-black border-t-black p-2 w-full focus:outline-none"
              />
              <RetroButton onClick={handleSearch}><Search className="h-5 w-5" /></RetroButton>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 h-[calc(100%-4rem)] overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </Window>
    </div>
  );
};

export default RoundHistory;