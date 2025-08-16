"use client";

import React from "react";
import Window from "./Window";
import Image from "next/image";
import {  RetroButton } from "@/components/RetroButton";
import styles from "../../../styles/SpotlightGames.module.css";
import { useRouter } from "next/navigation";

const SpotlightGames = () => {
  const router = useRouter();
  const games = [
    { name: "Wheely Wheely", image: "/images/wheel1.jpeg", link: "/wheely-wheely" },
    { name: "Coming Sone", image: "/images/wheel3.jpeg", link: "#" },
  ];

  const warningText = `🚨 WARNING: These games may drive you go crazy,
extreme addiction 🥵`;

  return (
    <Window title="🎮 SPOTLIGHT GAMES ⚔">
      <div className="h-full grid grid-cols-2 grid-rows-5 gap-4">
        <div className="col-span-2 row-span-4 grid grid-cols-2 gap-4">
          {games.map((game, index) => (
            <div
              key={index}
              className="bg-retro-gray-2 ring-4 ring-retro-gray-1 h-[300px] flex flex-col"
            >
              <div className="h-3/4">
                <Image
                  src={game.image}
                  alt={game.name}
                  width={319}
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/4 flex items-center justify-between p-2">
                <div className="flex items-center justify-between gap-2">
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{game.name}</span>
                </div>
                <RetroButton onClick={() => router.push(game.link)}>Play</RetroButton>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${styles.warningContainer} col-span-2 row-span-3 bg-black text-[24px] px-4 py-2 text-center text-retro-green`}
        >
          <p className={styles.warningText} data-text={warningText}>
            {warningText}
          </p>
        </div>
      </div>
    </Window>
  );
};

export default SpotlightGames;