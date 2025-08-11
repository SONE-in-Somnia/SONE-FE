"use client";

import { useKuro } from "@/context/KuroContext";
import HistoryItem from "@/views/wheely-wheely/components/HistoryItem";
import { Round } from "@/types/round";
import { useAppKitAccount } from "@reown/appkit/react";
import React, { useEffect, useState } from "react";
import Window from "@/views/home-v2/components/Window";
import { RetroButton } from "@/components/RetroButton";
import { cn } from "@/lib/utils";

const RoundHistory = () => {
  const {
    refetchHistories,
    allHistories,
    myWinHistories,
    isFetchingKuroHistory,
  } = useKuro();
  const [activeTab, setActiveTab] = useState<"all" | "my-wins">("all");
  const { address } = useAppKitAccount();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch histories when tab or page changes
  useEffect(() => {
    const historyType = activeTab === "all" ? "all" : "youWin";
    refetchHistories(currentPage, itemsPerPage, historyType);
  }, [activeTab, currentPage, refetchHistories, itemsPerPage]);

  // Determine which history data to display
  const currentHistories =
    activeTab === "all" ? allHistories : myWinHistories;
  const historyData = currentHistories?.data || [];
  const totalItems = currentHistories?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when switching tabs
  const handleTabClick = (tab: "all" | "my-wins") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <Window title="ROUND HISTORY" headerClassName="bg-green-700">
      <div className="flex h-[600px] flex-col p-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <RetroButton
            onClick={() => handleTabClick("all")}
            className={cn(
              "px-4 py-2 text-sm font-bold",
              activeTab === "all"
                ? "bg-retro-yellow text-retro-black"
                : "bg-gray-600 text-white",
            )}
          >
            All History
          </RetroButton>
          <RetroButton
            onClick={() => handleTabClick("my-wins")}
            className={cn(
              "px-4 py-2 text-sm font-bold",
              activeTab === "my-wins"
                ? "bg-retro-yellow text-retro-black"
                : "bg-gray-600 text-white",
            )}
          >
            Your Wins
          </RetroButton>
        </div>

        {/* History List */}
        <div className="mt-4 flex-grow flex-col gap-4 overflow-y-auto pr-2">
          {isFetchingKuroHistory ? (
            <p className="text-center text-white">Loading history...</p>
          ) : historyData.length > 0 ? (
            historyData.map((history, index) => (
              <HistoryItem
                history={history}
                key={`${history.roundId}-${index}`}
                isWinner={activeTab === "my-wins"}
              />
            ))
          ) : (
            <p className="text-center text-white">No history found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t-2 border-t-gray-700 pt-2">
          <span className="text-sm text-white">
            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
          </span>
          <RetroButton onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </RetroButton>
          <RetroButton
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            &gt;
          </RetroButton>
        </div>
      </div>
    </Window>
  );
};

export default RoundHistory;