import React from "react";
import Window from "./Window";
import { RetroButton } from "@/components/RetroButton";
import Link from "next/link";

const TestnetFaucet = () => {
  return (
    <Window title="🪙 SOMNIA TESTNET FAUCET 💧">
      <Link href="https://discord.gg/B7qYB8P2" target="_blank">
        <RetroButton className="w-full h-full">
          TAKE FREE TESTNET TOKEN
        </RetroButton>
      </Link>
    </Window>
  );
};

export default TestnetFaucet;