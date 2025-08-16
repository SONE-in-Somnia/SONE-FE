"use client";

import React from "react";
import Window from "./Window";
import { RetroButton } from "@/components/RetroButton";
import styles from "../../../styles/SonesHub.module.css";
import Link from "next/link";
import useGetLeaderboard from "@/api/useGetLeaderboard";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";

const SonesHub = () => {
  const {
    data: leaderboard = [],
    isLoading,
    isError,
  } = useGetLeaderboard();

  const activities: string[] = [];
  // Mock activities data
  // const activities = [
  //   "User1 deposited 100 STT",
  //   "User2 won 50 STT in Wheely Wheely",
  //   "User3 deposited 200 STT",
  //   "User4 won 100 STT in Wheely Wheely",
  //   "User5 deposited 50 STT",
  // ];

  const formattedLeaderboardData = leaderboard.map((player, index) => ({
    rank: index + 1,
    address: player.address,
    total_deposit: player.totalPoints,
  }));

  return (
    <Window title="🎮 SONE'S HUB ⚔">
      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Column 1: Featured Games */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-retro-gray border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-white border-t-white p-3 flex flex-col items-center justify-center text-center">
            <h4 className="font-bold text-lg mb-2">Wheely Wheely</h4>
            <p className="text-sm mb-3">Spin the wheel to win big prizes!</p>
            <Link href="/wheely-wheely">
              <RetroButton>Play Now</RetroButton>
            </Link>
          </div>
          <div className="bg-retro-gray border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-white border-t-white p-3 flex flex-col items-center justify-center text-center blur-sm">
            <h4 className="font-bold text-lg mb-2">Jackpot</h4>
            <p className="text-sm mb-3">
              Contribute to the pot and win it all!
            </p>
            <RetroButton disabled>Play Now</RetroButton>
          </div>
          <div className="bg-retro-gray border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-white border-t-white p-3 flex flex-col items-center justify-center text-center blur-sm">
            <h4 className="font-bold text-lg mb-2">Coin Flip</h4>
            <p className="text-sm mb-3">
              A 50/50 chance to double your money.
            </p>
            <RetroButton disabled>Play Now</RetroButton>
          </div>
        </div>

        {/* Column 2: Live Activity Feed */}
        <div className="col-span-1">
          {isLoading && <p>Loading activities...</p>}
          {isError && <p className="text-red-500">Failed to load activities</p>}
          {!isLoading &&
            !isError &&
            activities.map((activity, index) => {
              const parts = activity.split(/(\d+\.?\d*)/g);
              return (
                <div
                  key={index}
                  className="bg-retro-gray border-2 border-r-retro-gray-3 border-b-retro-gray-3 border-l-white border-t-white p-1 mb-3 flex justify-between ring-4 ring-retro-black/20"
                >
                  <span>
                    {parts.map((part, i) =>
                      /(\d+\.?\d*)/.test(part) ? (
                        <span key={i} className="font-bold">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </span>
                  <span className="text-gray-500">now</span>
                </div>
              );
            })}
        </div>

        {/* Column 3: Leaderboard & CTA */}
        <div
          className={`${styles.warningEffect} col-span-2 p-3 text-white flex flex-col items-center justify-between text-center h-full`}
        >
          <div>
            <h3 className="font-bold text-xl mb-2">🏆 Top Winners 🏆</h3>
            {isLoading && <p>Loading leaderboard...</p>}
            {isError && <p className="text-red-500">Failed to load leaderboard.</p>}
            {!isLoading && !isError && <LeaderboardTable data={formattedLeaderboardData} />}
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-[24px]">
              LET'S GO NUT JOIN WITH US
            </h3>
            <p className="my-4 text-[24px] font-bold">
              GET LISTED ON SONE NOW DUDE
            </p>
            <a
              href="https://x.com/somnia_network?lang=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RetroButton>DM NOW</RetroButton>
            </a>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default SonesHub;
