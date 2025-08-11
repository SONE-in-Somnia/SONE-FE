"use client";

import React, { useState, useEffect, useMemo } from "react";
import  RetroButton  from "@/components/RetroButton";
import { Input } from "@/components/ui/input";
import { useAccount, useBalance } from "wagmi";
import RetroPanel from "@/components/customized/RetroPanel";
import { toast } from "react-toastify";
import { useKuro } from "@/context/KuroContext";
import { formatEther } from "viem";

const InputPanel = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { kuroData, addEntry } = useKuro();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userTotalEntries, winChance } = useMemo(() => {
    if (!kuroData || !address) {
      return { userTotalEntries: 0, winChance: "0.00%" };
    }

    const userEntries =
      kuroData.participants
        .filter((p) => p.address.toLowerCase() === address.toLowerCase())
        .reduce(
          (acc, p) =>
            acc + p.deposits.reduce((dAcc, d) => dAcc + BigInt(d.amount), 0n),
          0n,
        ) || 0n;

    const totalPot = BigInt(kuroData.totalValue);
    const chance =
      totalPot > 0n ? (Number(userEntries) / Number(totalPot)) * 100 : 0;

    return {
      userTotalEntries: parseFloat(formatEther(userEntries)),
      winChance: `${chance.toFixed(2)}%`,
    };
  }, [kuroData, address]);

  const handleSubmit = async () => {
    if (!amount || !address) return;
    const depositAmount = parseFloat(amount);
    const userBalance = balance ? parseFloat(balance.formatted) : 0;
    if (depositAmount > userBalance) {
      toast.error("Your balance is not enough");
      return;
    }

    setIsSubmitting(true);
    const hash = await addEntry(address, amount);
    if (hash) {
      setAmount("");
    }
    setIsSubmitting(false);
  };

  const currencySymbol = balance?.symbol || "STT";

  return (
    <RetroPanel title="INPUT YOUR ENTRY" headerClassName="bg-green-700">
      <div className="flex flex-col gap-4 text-retro-black p-2">
        <div>
          <p className="text-[16px]">Your Entries</p>
          <p className="font-bold text-[24px]">
            {userTotalEntries.toFixed(4)} {currencySymbol}
          </p>
        </div>
        <div className="border-b-2 border-b-white pb-4">
          <p className="text-[16px]">Your Win Chance</p>
          <p className="font-bold text-[24px]">{winChance}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            className="bg-transparent !text-[72px] border-none text-retro-black font-bold focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[72px] placeholder:text-retro-black h-20"
          />
          <span className="text-[24px] font-bold mt-10">
            ({currencySymbol})
          </span>
        </div>
        <p className="text-xs">
          Balance:{" "}
          <span className="font-bold">
            {balance
              ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
              : `0 ${currencySymbol}`}
          </span>
        </p>
        <RetroButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
        </RetroButton>
      </div>
    </RetroPanel>
  );
};

export default InputPanel;