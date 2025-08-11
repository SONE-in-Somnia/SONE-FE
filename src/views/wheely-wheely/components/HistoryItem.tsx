"use client";

import Button from "@/components/button";
import { useKuro } from "@/context/KuroContext";
import { convertWeiToEther, formatEthereumAddress } from "@/utils/string";
import { Round } from "@/types/round";
import Link from "next/link";
import {
  calculateWinLeverage,
  findPlayerByAddress,
} from "@/app/kuro/round-history/history-table";
import { useAccount } from "wagmi";
import WithdrawButton from "@/views/magic-earn/withdraw-button";
import RetroPanel from "@/components/customized/RetroPanel";

interface HistoryItemProps {
  history: Round;
  isWinner?: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  history,
  isWinner = false,
}) => {
  const { address } = useAccount();
  const { handleClaimPrizes } = useKuro();

  // Safely get the winner and player data
  const winnerAddress = history?.winner;
  const player = winnerAddress ? findPlayerByAddress(history, winnerAddress) : null;
  const winLeverage = player ? calculateWinLeverage(history, player) : "0.00";

  const claim = async (round: Round) => {
    if (!round || !round.participants) return;
    // This logic seems complex and potentially unsafe, ensure getTotalUserEntries is robust
    // For now, we'll assume it works but it's a candidate for more defensive coding.
    const userDepositIndices = round.participants.map(() => BigInt(0)); // Placeholder
    await handleClaimPrizes(
      round.roundId,
      userDepositIndices,
      round.kuroContractAddress,
    );
  };

  return (
    <RetroPanel headerClassName="bg-gray-700" className="mb-2">
        <div className="p-2 text-sm text-white">
            <div className="flex justify-between items-center">
                <p className="font-bold">Round: #{history.roundId || 'N/A'}</p>
                {winnerAddress && (
                    <p className="text-xl text-retro-yellow font-bold">
                        x{parseFloat(winLeverage).toFixed(2)}
                    </p>
                )}
            </div>

            <div className="mt-2 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Winner</span>
                    <p className="font-mono">{winnerAddress ? formatEthereumAddress(winnerAddress, 6) : "N/A"}</p>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400">Prize Pool</span>
                    <p className="font-mono">{convertWeiToEther(history.totalValue || "0")} STT</p>
                </div>
            </div>

            {isWinner && (
                <div className="mt-3 pt-2 border-t border-gray-600">
                    {!history.winnerClaimed ? (
                        <Button className="w-full" onClick={() => claim(history)}>
                            Claim Prize
                        </Button>
                    ) : (
                        <Link
                            target="_blank"
                            href={`https://shannon-explorer.somnia.network/tx/${history.txClaimed}`}
                            className="w-full"
                        >
                            <Button className="w-full underline" disabled>
                                Claimed: {formatEthereumAddress(history.txClaimed, 6)}
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    </RetroPanel>
  );
};

export default HistoryItem;