// src/app/raffle/layout.tsx
"use client";

import { RaffleProvider } from "@/context/RaffleContext";

export default function RaffleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RaffleProvider>{children}</RaffleProvider>;
}
