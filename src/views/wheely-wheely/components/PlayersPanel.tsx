"use client";

import React from "react";
import RetroPanel from "@/components/customized/RetroPanel";
import { useKuro } from "@/context/KuroContext";
import { formatEther } from "viem";

const colors = ["#FACC15", "#F87171", "#A78BFA", "#60A5FA", "#34D399"];

const PlayersPanel = () => {
  const { kuroData } = useKuro();
  const players = kuroData?.participants || [];

  return (
    <RetroPanel
      title="PLAYERS"
      headerClassName="bg-green-700"
      headerContent={
        <span className="text-sm text-white">{players.length}/100</span>
      }
    >
      <div className="flex flex-col gap-2 text-white">
        {players.map((player, index) => (
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
              {formatEther(
                player.deposits.reduce(
                  (acc, d) => acc + BigInt(d.amount),
                  BigInt(0),
                ),
              )}{" "}
              STT
            </span>
          </div>
        ))}
      </div>
    </RetroPanel>
  );
};

export default PlayersPanel;
