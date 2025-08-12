"use client";

import React, { useState, useEffect } from "react";
import Window from "./Window";
import { RetroButton } from "@/components/RetroButton";
import styles from "../../../styles/SonesHub.module.css";
import Link from "next/link";

type Player = {
  name: string;
  score: number;
};

const SonesHub = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Replace with your actual API endpoints
      const activitiesResponse = await fetch("/api/activities");
      const leaderboardResponse = await fetch("/api/leaderboard");

      if (!activitiesResponse.ok || !leaderboardResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const activitiesData = await activitiesResponse.json();
      const leaderboardData = await leaderboardResponse.json();

      setActivities(activitiesData);
      setLeaderboard(leaderboardData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data
    const interval = setInterval(fetchData, 5000); // Poll for new data every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
          {loading && <p>Loading activities...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && activities.map((activity, index) => {
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
            {loading && <p>Loading leaderboard...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <ul className="text-left">
                {leaderboard.map((player, index) => (
                  <li key={player.name} className="mb-1">
                    {index + 1}. {player.name} - {player.score.toFixed(3)} STT
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-[24px]">LET'S GO NUT JOIN WITH US</h3>
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
