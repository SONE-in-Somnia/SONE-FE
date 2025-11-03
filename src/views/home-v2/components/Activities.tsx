"use client";

import React from "react";
import Window from "./Window";
import useGetRecentActivity from "@/api/useGetRecentActivity";

const Activities = () => {
  const { data: activities = [], isLoading, isError } = useGetRecentActivity();

  return (
    <Window title="🎮 ACTIVITIES ⚔">
      <div className="h-full overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="font-pixel-operator">Loading activities...</p>
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 font-pixel-operator">Failed to load activities</p>
          </div>
        )}
        {!isLoading && !isError && activities.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-pixel-operator">No recent activities</p>
          </div>
        )}
        {!isLoading &&
          !isError &&
          activities.map((activity: any, index: number) => {
            const parts = activity.description?.split(/(\d+\.?\d*)/g) || [];
            const timeAgo = activity.createdAt
              ? new Date(activity.createdAt).toLocaleTimeString()
              : "now";

            return (
              <div
                key={activity.id || index}
                className="bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white p-1 mb-3 flex justify-between ring-4 ring-retro-black/20"
              >
                <span className="text-sm">
                  {parts.map((part: string, i: number) =>
                    /(\d+\.?\d*)/.test(part) ? (
                      <span key={i} className="font-bold">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </span>
                <span className="text-gray-500 text-xs whitespace-nowrap">{timeAgo}</span>
              </div>
            );
          })}
      </div>
    </Window>
  );
};

export default Activities;
