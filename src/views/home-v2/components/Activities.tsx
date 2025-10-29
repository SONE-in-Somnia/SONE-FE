"use client";

import React from "react";
import Window from "./Window";

const activities: string[] = [
  "0x00..234 just win 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
  "0x00..234 just dep 0.234 ETH in wheely game 3 mins",
];

const Activities = () => {
  // For now, we'll use mock data. In a real scenario, this would come from an API.
  const isLoading = false;
  const isError = false;

  return (
    <Window title="🎮 ACTIVITIES ⚔">
      {isLoading && <p>Loading activities...</p>}
      {isError && <p className="text-red-500">Failed to load activities</p>}
      {!isLoading &&
        !isError &&
        activities.map((activity, index) => {
          const parts = activity.split(/(\d+\.?\d*)/g);
          return (
            <div
              key={index}
              className="bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white p-1 mb-3 flex justify-between ring-4 ring-retro-black/20"
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
    </Window>
  );
};

export default Activities;
