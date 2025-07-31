"use client";
import PlayerItem from "./PlayerItem";
import { Eye } from "lucide-react";
import { useKuro } from "@/context/KuroContext";
import { useEffect, useState } from "react";
import { colors } from "./PoolWheelOrigin";
import { KuroParticipant } from "@/types/round";
import { getUserEntries } from "./TotalPlayer";
import { convertWeiToEther } from "@/utils/string";
import Card from "@/components/card";

interface ColoredParticipant extends KuroParticipant {
  color: string;
}

const PoolPlayers = () => {
  const { kuroData } = useKuro();

  const [kuroDataWithColor, setKuroDataWithColor] = useState<
    ColoredParticipant[] | null
  >(null);
  const [sortedPlayers, setSortedPlayers] = useState<ColoredParticipant[]>([]);

  useEffect(() => {
    if (!kuroData) return;

    const newData = kuroData.participants.map((player, index) => ({
      ...player,
      color: colors[index] || colors[index % colors.length],
    }));

    setKuroDataWithColor(newData);
  }, [kuroData]);

  useEffect(() => {
    if (!kuroDataWithColor) return;

    const sortedPlayers = [...kuroDataWithColor].sort(
      (a, b) =>
        getUserEntries(b.address, kuroData) -
        getUserEntries(a.address, kuroData),
    );

    setSortedPlayers(sortedPlayers);
  }, [kuroDataWithColor]);

  if (!kuroData) return null;

  return (
    <div className="px-5">
      <Card
        className={`relative !bg-[#2b2451] p-6 transition-all ${sortedPlayers.length > 0 ? "translate-y-0" : "translate-y-1/2"}`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="sticky top-0 flex items-center justify-between font-semibold">
            <div className="flex items-center gap-3">
              <span className="text-white/75 opacity-50">Players</span>
              {"  "}
              <span className="text-[#BBFBFF]">
                {sortedPlayers.length} / 50
              </span>
            </div>
            {/* <div className="flex items-center gap-2 text-primary">
            <Eye />
          </div> */}
          </div>
          <div className="mt-2 flex h-full w-full gap-2.5 overflow-auto">
            {sortedPlayers.map((player, index) => {
              return (
                <PlayerItem
                  key={player.address}
                  rank={index + 1}
                  avatar="/images/monad.svg"
                  address={player.address}
                  winrate={(
                    (getUserEntries(player.address, kuroData) /
                      parseFloat(convertWeiToEther(kuroData.totalValue))) *
                    100
                  ).toFixed(2)}
                  totalDeposits={getUserEntries(
                    player.address,
                    kuroData,
                  ).toString()}
                  color={player.color}
                />
              );
            })}

            {sortedPlayers.length == 0 && (
              <div className="grid h-[60px] place-items-center">
                <p className="text-white/50">Waiting for first deposit...</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PoolPlayers;
