"use client";

import React from "react";
import Countdown from "@/components/Countdown";
import { useKuro } from "@/context/KuroContext";

const RoundInfoPanel = () => {
  const { kuroData } = useKuro();

  return (
    <div className="bg-black border-2 border-retro-pink p-2 text-center">
      <div className="text-retro-pink font-pixel-operator-mono font-bold">
        Round #{kuroData?.roundId || 0} - Start in:{" "}
        <Countdown
          endTime={kuroData?.endTime || 0}
        />
      </div>
    </div>
  );
};

export default RoundInfoPanel;
