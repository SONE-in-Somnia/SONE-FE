"use client";

import React, { useState } from "react";
import Window from "@/views/home-v2/components/Window";
import { RetroButton } from "@/components/RetroButton";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  round: number;
  winner: string;
  multiplier: number;
  pool: number;
}

const mockHistory: HistoryEntry[] = Array.from({ length: 25 }, (_, i) => ({
  round: 1234 - i,
  winner: `0x0023...3456`,
  multiplier: 20,
  pool: 0.2345,
}));

const RoundHistory = () => {
  const [activeTab, setActiveTab] = useState<"all" | "my-wins">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(mockHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = mockHistory.slice(startIndex, endIndex);

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

  return (
    <Window title="ROUND HISTORY" headerClassName="bg-green-700">
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <RetroButton
            onClick={() => setActiveTab("all")}
            className={cn(activeTab === "all" ? "bg-gray-400" : "bg-gray-600")}
          >
            All
          </RetroButton>
          <RetroButton
            onClick={() => setActiveTab("my-wins")}
            className={cn(activeTab === "my-wins" ? "bg-gray-400" : "bg-gray-600")}
          >
            Your win
          </RetroButton>
        </div>

        {/* History List */}
        <div className="flex-grow space-y-2">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="bg-retro-gray border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-white border-t-white p-1 mb-3 flex justify-between ring-4 ring-retro-black/20"
            >
              <span>Round #{item.round}</span>
              <span className="underline">{item.winner}</span>
              <span className="text-blue-400">x{item.multiplier}</span>
              <span>Pool win {item.pool} ETH</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <RetroButton onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </RetroButton>
          <RetroButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </RetroButton>
        </div>
      </div>
    </Window>
  );
};

export default RoundHistory;
