"use client";

import React from "react";
import Window from "./Window";
import useGetLeaderboard from "@/api/useGetLeaderboard";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";

const Leaderboard = () => {
  const {
    data: leaderboard = [],
    isLoading,
    isError,
  } = useGetLeaderboard();

  const formattedLeaderboardData = leaderboard.map((player, index) => ({
    rank: index + 1,
    address: player.address,
    total_deposit: player.totalPoints,
  }));

  return (
    <Window title="🏆 LEADERBOARD 🏆">
      {isLoading && <p>Loading leaderboard...</p>}
      {isError && <p className="text-red-500">Failed to load leaderboard.</p>}
      {!isLoading && !isError && <LeaderboardTable data={formattedLeaderboardData} />}
    </Window>
  );
};

export default Leaderboard;
