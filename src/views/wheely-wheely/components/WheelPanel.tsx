"use client";

import React, { useState } from "react";
import Window from "@/views/home-v2/components/Window";
import NumberCounter from "@/components/NumberCounter";
import { useGetWheelyWheelyPlayers } from "@/api/wheely-wheely/useGetWheelyWheelyPlayers";
import { formatEther } from "viem";
import InputPanel from "./InputPanel";
import PlayersPanel from "./PlayersPanel";
import HistoryPanel from "./HistoryPanel";
import { RetroButton } from "@/components/RetroButton";
import { useRouter } from "next/navigation";
import RoundInfoPanel from "./RoundInfoPanel";
import { KuroProvider } from "@/context/KuroContext";
import PoolWheelOrigin from "@/views/magic-earn/PoolWheelOrigin";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoundHistory from "../RoundHistory";
import { useGetWheelyGameData } from "@/api/wheely-wheely/useGetWheelyGameData";
// import DevPanel from "./DevPanel";




const WheelPanelWithProvider = () => {
  // This hook will continuously fetch data and update the context
  useGetWheelyGameData();

  const { players, isLoading } = useGetWheelyWheelyPlayers();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);


  const titleComponent = (
    <div className="flex items-center gap-2">
      <RetroButton onClick={() => router.back()} className="px-2 py-0 text-sm">
        &lt;
      </RetroButton>
      <h2 className="text-[16px] font-pixel-operator-mono font-bold">
        WHEELY WHEELY
      </h2>
    </div>
  );

  return (
      <Window title={titleComponent} headerClassName="bg-retro-blue">
        <div className="relative h-full p-4">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-noise"
            style={{ backgroundImage: "url('/images/wheely-img.png')" }}
          />
          {/* Content Grid */}
          <div className="relative grid grid-cols-12 gap-6 h-full">
            {/* Left Column */}
            <div className="col-span-4 flex flex-col gap-6">
              <RoundInfoPanel />
              <InputPanel />
            <PlayersPanel />
            {/* <DevPanel/> */}
            </div>
            {/* Right Column (Main content) */}
            <div className="col-span-8 relative flex items-center justify-center">
              <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogTrigger asChild>
                  <div className="absolute top-2 right-2 z-10">
                    <HistoryPanel />
                  </div>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none max-w-4xl">
                  <RoundHistory />
                </DialogContent>
              </Dialog>

              {isLoading ? (
                <div className="text-white">Loading...</div>
              ) : (
                <div className="relative flex items-center justify-center">
                  <PoolWheelOrigin size={650} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Window>
  );
};

const WheelPanel = () => (
  <KuroProvider>
    <WheelPanelWithProvider />
  </KuroProvider>
);

export default WheelPanel;