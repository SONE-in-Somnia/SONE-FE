"use client";

import React, { useEffect, useState } from "react";
import RetroPanel from "@/components/customized/RetroPanel";
import { useKuro } from "@/context/KuroContext";
import { formatEther } from "viem";
import { colors } from "@/views/magic-earn/PoolWheelOrigin";
import { KuroParticipant } from "@/types/round";

// Helper function to calculate total deposits for a player
const getTotalDeposits = (player: KuroParticipant): bigint => {
  if (!player || !player.deposits) {
    return BigInt(0);
  }
  return player.deposits.reduce((acc, d) => acc + BigInt(d.amount), BigInt(0));
};

const PlayersPanel = () => {
  const { kuroData } = useKuro();
  const [sortedPlayers, setSortedPlayers] = useState<KuroParticipant[]>([]);

  useEffect(() => {
    if (kuroData?.participants) {
      const playersWithDeposits = kuroData.participants.filter(
        (p) => getTotalDeposits(p) > 0,
      );

      const sorted = [...playersWithDeposits].sort((a, b) => {
        const totalB = getTotalDeposits(b);
        const totalA = getTotalDeposits(a);
        // Sort in descending order
        if (totalB > totalA) return 1;
        if (totalB < totalA) return -1;
        return 0;
      });
      setSortedPlayers(sorted);
    } else {
      setSortedPlayers([]);
    }
  }, [kuroData]);

  return (
    <RetroPanel
      title="PLAYERS"
      headerClassName="bg-green-700"
      headerContent={
        <span className="text-white text-sm">
          {sortedPlayers.length}/100
        </span>
      }
    >
      <div className="flex h-full flex-col gap-2 overflow-y-auto pr-2 text-white">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <div
              key={player.address}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span>{`${player.address.slice(0, 6)}...${player.address.slice(
                  -4,
                )}`}</span>
              </div>
              <span>
                {formatEther(getTotalDeposits(player))} STT
              </span>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-white/50">Waiting for players...</p>
          </div>
        )}
      </div>
    </RetroPanel>
  );
};

export default PlayersPanel;
