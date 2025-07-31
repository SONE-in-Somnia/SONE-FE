"use client";
import { KuroData, useKuro } from "@/context/KuroContext";
import Image from "next/image";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

export const getUserEntries = (address: string, kuroData: KuroData | null) => {
  if (!kuroData || !kuroData.participants || !address) return 0;
  const user = kuroData.participants.find(
    (p) => p.address.toLowerCase() === address.toLowerCase(),
  );

  if (!user) return 0;
  const deposit = user.deposits.reduce((sum, deposit) => {
    return sum + Number(deposit.amount);
  }, 0);

  return Number(formatEther(BigInt(deposit)));
};

export const getTotalEntries = (kuroData: KuroData | null) => {
  return formatEther(BigInt(kuroData?.totalValue || "0"));
};

export const calculateWinChance = (
  address: string,
  kuroData: KuroData | null,
) => {
  if (!kuroData || BigInt(kuroData.totalValue || "0") === BigInt(0)) {
    return "0%";
  }

  const userEntries = getUserEntries(address, kuroData);
  const totalEntries = Number(formatEther(BigInt(kuroData.totalValue || "0")));
  const winChance = (userEntries / totalEntries) * 100;
  return `${winChance.toFixed(2)}%`;
};

const TotalPlayer = () => {
  const { kuroData } = useKuro();
  const { address } = useAccount();

  // Tính số entries của người dùng hiện tại

  // Tính tỷ lệ thắng dựa trên entries

  // Tính tổng số entries của tất cả người chơi

  return (
    <div className="flex items-center justify-around border-b border-primary/50 pb-6 text-white">
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-center font-normal opacity-50">Players</p>
        <p className="text-center text-xl font-semibold">
          <span>{kuroData?.participants?.length}</span>
          <span className="opacity-50">/100</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-center font-normal opacity-50">Your Entries</p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={"/images/monad_logo.svg"}
            alt="logo"
            width={24}
            height={24}
          />
          <p className="text-center text-xl font-semibold">
            {getUserEntries(address as string, kuroData)}
            <span className="text-sm opacity-50">
              /{getTotalEntries(kuroData)}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-center font-normal opacity-50">Your Win Chance</p>
        <p className="text-center text-xl font-semibold">
          {calculateWinChance(address as string, kuroData) || "0%"}
        </p>
      </div>
    </div>
  );
};

export default TotalPlayer;
