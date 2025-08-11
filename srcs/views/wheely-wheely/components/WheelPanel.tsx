"use client";

import React, { useState } from "react";
import Window from "@/views/home-v2/components/Window";
import InputPanel from "./InputPanel";
import PlayersPanel from "./PlayersPanel";
import HistoryPanel from "./HistoryPanel";
import RetroButton from "@/components/RetroButton";
import { useRouter } from "next/navigation";
import RoundInfoPanel from "./RoundInfoPanel";
import PoolWheelOrigin from "@/views/magic-earn/PoolWheelOrigin";
import { KuroProvider } from "@/context/KuroContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoundHistory from "../RoundHistory";
import DevPanel from "./DevPanel"; // Import the new DevPanel

const WheelPanelWithProvider = () => {
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
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Column */}
        <div className="col-span-4 flex flex-col gap-6">
          <RoundInfoPanel />
          <InputPanel />
          <PlayersPanel />
          <DevPanel /> {/* Add the DevPanel here */}
        </div>

        {/* Right Column (Main content with its own background) */}
        <div className="col-span-8 relative overflow-hidden border-2 border-black">
          {/* Blurred Background for this panel only */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm"
            style={{ backgroundImage: "url('/images/wheely-img.png')" }}
          />

          {/* Content for this panel */}
          <div className="relative h-full flex items-center justify-center">
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

            <PoolWheelOrigin size={500} />
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
