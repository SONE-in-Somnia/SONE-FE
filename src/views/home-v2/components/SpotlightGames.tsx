import React from "react";
import Window from "./Window";
import Image from "next/image";
import { RetroButton } from "@/components/RetroButton";

const SpotlightGames = () => {
  const games = [
    { name: "Game name", image: "/images/spotlight-img.png" },
    { name: "Game name", image: "/images/spotlight-img.png" },
  ];

  return (
    <Window title="🎮 SPOTLIGHT GAMES ⚔">
      <div className="h-full grid grid-cols-2 grid-rows-5 gap-4">
        <div className="col-span-2 row-span-4 grid grid-cols-2 gap-4">
          {games.map((game, index) => (
            <div key={index} className="bg-retro-gray-2 ring-4 ring-retro-gray-1 h-[300px] flex flex-col">
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
                  <div className="w-10 h-10 rounded-full bg-retro-gray"></div>
                  <span className="font-bold">{game.name}</span>
                </div>
                <RetroButton>
                  Play
                </RetroButton>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2 row-span-3 bg-black text-[24px] text-retro-pink p-4 text-center leading-5">
          <p className="text-glitch-effect" data-text="🚨 WARNING: These games may drive you go crazy, extreme addiction 🥵">
            🚨 WARNING: These games may drive you go crazy,
            <br /> extreme addiction 🥵
          </p>
        </div>
      </div>
    </Window>
  );
};

export default SpotlightGames;
