"use client";

import WheelyDepositPanel from "@/views/wheely-wheely/components/WheelyDepositPanel";
import RoundState from "@/views/magic-earn/RoundState";
import PoolPlayers from "@/views/magic-earn/PoolPlayers";


import React, { useState, useEffect } from "react";
import Window from "@/views/home-v2/components/Window";
import { useGetWheelyWheelyPlayers } from "@/api/wheely-wheely/useGetWheelyWheelyPlayers";
import PlayersPanel from "@/views/wheely-wheely/components/PlayersPanel";
import HistoryPanel from "@/views/wheely-wheely/components/HistoryPanel";
import { RetroButton } from "@/components/RetroButton";
import { useRouter } from "next/navigation";
import RoundInfoPanel from "@/views/wheely-wheely/components/RoundInfoPanel";
import { KuroProvider, useKuro } from "@/context/KuroContext";
import PoolWheelOrigin from "@/views/magic-earn/PoolWheelOrigin";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoundHistory from "@/views/magic-earn/RoundHistory";

const WheelPanelWithProvider = () => {
  const { players, isLoading } = useGetWheelyWheelyPlayers();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { registerKuroListener, unRegisterKuroListener, kuroData } = useKuro();

  useEffect(() => {
    registerKuroListener();
    return () => {
      unRegisterKuroListener();
    };
  }, [registerKuroListener, unRegisterKuroListener]);

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
      <div className="relative h-screen p-4">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-noise"
          style={{ backgroundImage: "url('/images/wheely-img.png')" }}
        />
        {/* Content Grid */}
        <div className="relative grid h-full grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-4 flex flex-col gap-6">
            <RoundInfoPanel />
            <WheelyDepositPanel />
            <PlayersPanel />
          </div>
          {/* Right Column (Main content) */}
          <div className="relative col-span-8 flex items-center justify-center">
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <div className="absolute right-2 top-2 z-10">
                  <HistoryPanel />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl border-none bg-transparent p-0">
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

const WheelyWheelyPage = () => {
  return (
    <KuroProvider>
      <WheelPanelWithProvider />
    </KuroProvider>
  );
};

export default WheelyWheelyPage;