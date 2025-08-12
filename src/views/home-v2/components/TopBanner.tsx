import React from "react";
import Window from "./Window";

const TopBanner = () => {
  return (
    <Window title="🚀 WELCOME TO DEGENZ GAMING HUB ON SOMNIA NETWORK 🚀">
      <div className="bg-black text-retro-pink ring-2 ring-retro-pink text-center p-1 h-full flex items-center justify-center">
        <h1 className="animate-color-stroke-flow text-[32px] tracking-widest leading-5 [-webkit-text-stroke-width:1px]">
          THE BLOCKCHAIN FOR GAMING AND ENTERTAINMENT, OFFERING 1M+ TPS,
          <br /> SUB-SECOND FINALITY AND SUB-CENT FEES.
        </h1>
      </div>
    </Window>
  );
};

export default TopBanner;
