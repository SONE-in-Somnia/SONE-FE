// src/components/raffle/RaffleCardHeader.tsx
import React from 'react';

const RaffleCardHeader = ({ name }: { name: string }) => (
  <h2 className="text-2xl font-bold mb-4 text-center font-pixel-operator-mono">{name}</h2>
);

export default RaffleCardHeader;
