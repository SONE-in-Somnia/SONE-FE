// src/components/raffle/RaffleCardHeader.tsx
import React from 'react';

import { cn } from "@/lib/utils";

const RaffleCardHeader = ({ name, isCompleted }: { name: string, isCompleted: boolean }) => (
  <h2 className={cn("text-2xl font-bold mb-4 text-center font-pixel-operator-mono", isCompleted && "text-retro-gray-2")}>{name}</h2>
);

export default RaffleCardHeader;
