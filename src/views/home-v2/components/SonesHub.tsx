import React from "react";
import Window from "./Window";
import { RetroButton } from "@/components/RetroButton";
import styles from "./SonesHub.module.css";

const SonesHub = () => {
  const activities = [
    "0x00...234 just win 0.234 ETH in wheely game",
    "0x00...234 just dep 0.234 ETH in wheely game",
    "0x00...234 just dep 0.234 ETH in wheely game",
    "0x00...234 just dep 0.234 ETH in wheely game",
    "0x00...234 just dep 0.234 ETH in wheely game",
    "0x00...234 just dep 0.234 ETH in wheely game",
  ];

  return (
    <Window title="🎮 SONE'S HUB ⚔">
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-2">
          {activities.map((activity, index) => {
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
                <span className="text-gray-500">3 mins</span>
              </div>
            );
          })}
        </div>
        <div
          className={`${styles.warningEffect} col-span-1 p-3 text-white flex flex-col items-center justify-start text-center h-full`}
        >
          <h3 className="font-bold text-[24px]">LET'S GO NUT JOIN WITH US</h3>
          <p className="my-4 text-[24px] font-bold">
            GET LISTED ON SONE NOW DUDE
          </p>
          <RetroButton>DM NOW</RetroButton>
        </div>
      </div>
    </Window>
  );
};

export default SonesHub;
