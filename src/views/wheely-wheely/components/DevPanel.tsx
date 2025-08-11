"use client";

import React from "react";
import { RetroButton } from "@/components/RetroButton";
import { useKuro } from "@/context/KuroContext";
import RetroPanel from "@/components/customized/RetroPanel";

const mockAddresses = [
  "0x1234...abcd",
  "0x5678...efgh",
  "0x9012...ijkl",
  "0x3456...mnop",
];

const DevPanel = () => {
  const { addEntry } = useKuro();

  const handleMockDeposit = (address: string) => {
    // Generate a random deposit amount between 0.1 and 1.5 for variety
    const randomAmount = (Math.random() * 1.4 + 0.1).toFixed(4);
    addEntry(address, randomAmount);
  };

  // This component will only render in the development environment
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <RetroPanel title="DEV TOOLS" headerClassName="bg-red-700">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-white mb-2">
          Click to simulate deposits from other wallets:
        </p>
        {mockAddresses.map((address) => (
          <RetroButton
            key={address}
            onClick={() => handleMockDeposit(address)}
            className="text-xs"
          >
            {address}
          </RetroButton>
        ))}
      </div>
    </RetroPanel>
  );
};

export default DevPanel;
