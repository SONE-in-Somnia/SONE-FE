import Button from "@/components/button";
import { useKuro } from "@/context/KuroContext";
import { convertWeiToEther, formatEthereumAddress } from "@/utils/string";
import { Round } from "@/types/round";
import Link from "next/link";
import Image from "next/image";
import {
  calculateWinLeverage,
  findPlayerByAddress,
} from "@/app/kuro/round-history/history-table";
import { useAccount } from "wagmi";
import PopupShareWinRound from "@/components/ui/PopupShareWinRound";
import { ShareIcon } from "lucide-react";
import WithdrawButton from "./withdraw-button";
import { getTotalUserEntries } from "./RoundHistory";
import { IconChevronsUp } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const claim = async (round: Round) => {
    if (round.kuroContractAddress) {
      await handleClaimPrizes(
        round.roundId,
        round.participants.map((p) => getTotalUserEntries(round, p.address)),
        round.kuroContractAddress,
      );
    }
  };

  return (
    <div className="relative min-w-[190px] items-center justify-between rounded-md bg-background px-4 py-3">
      <div className="flex flex-col gap-2">
        <p>
          <span className="font-medium">Round: #{history.roundId}</span>
        </p>
        <p className="text-xl text-[#9C63FA]">
          x{" "}
          {calculateWinLeverage(
            history,
            findPlayerByAddress(history, history.winner),
          )}
        </p>
        <p className="font-medium">{formatEthereumAddress(history?.winner)}</p>

        <div className="flex items-center justify-between gap-1 font-medium">
          <div className="">Pool win</div>
          <div className="">{convertWeiToEther(history.totalValue)} STT</div>
        </div>
      </div>
      {isWinner &&
        !history.winnerClaimed &&
        (history?.participants?.length === 1 ? (
          <WithdrawButton round={history} className="mt-3 w-full" />
        ) : (
          <Button
            className="mt-3 w-full"
            onClick={() => {
              if (history.kuroContractAddress) {
                claim(history);
              }
            }}
          >
            Claim
          </Button>
        ))}

      {isWinner && history?.winnerClaimed && (
        <div className="flex items-center gap-2">
          {/* <Link
            target="_blank"
            href={``}
            className="cursor-pointer text-sm underline hover:underline"
          >
            {formatEthereumAddress(history?.txClaimed)}
          </Link> */}
          <Link
            target="_blank"
            href={`https://shannon-explorer.somnia.network/tx/${history.txClaimed}`}
            className="w-full"
          >
            <Button className="mt-3 w-full underline">
              {formatEthereumAddress(history.txClaimed)}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
