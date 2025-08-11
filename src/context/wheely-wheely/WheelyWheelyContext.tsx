"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Player {
  id: string;
  address: string;
  amount: number;
  color: string;
}

interface WheelyWheelyState {
  players: Player[];
  totalPot: number;
  addPlayer: (player: Omit<Player, 'id' | 'color'>) => void;
}

const WheelyWheelyContext = createContext<WheelyWheelyState | undefined>(
  undefined
);

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];

export const WheelyWheelyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalPot, setTotalPot] = useState(0);

  const addPlayer = useCallback((player: Omit<Player, 'id' | 'color'>) => {
    setPlayers((prevPlayers) => {
      const newPlayer: Player = {
        ...player,
        id: `player-${prevPlayers.length}`,
        color: colors[prevPlayers.length % colors.length],
      };
      return [...prevPlayers, newPlayer];
    });
    setTotalPot((prevPot) => prevPot + player.amount);
  }, []);

  const state: WheelyWheelyState = {
    players,
    totalPot,
    addPlayer,
  };

  return (
    <WheelyWheelyContext.Provider value={state}>
      {children}
    </WheelyWheelyContext.Provider>
  );
};

export const useWheelyWheely = () => {
  const context = useContext(WheelyWheelyContext);
  if (context === undefined) {
    throw new Error("useWheelyWheely must be used within a WheelyWheelyProvider");
  }
  return context;
};