"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKuro } from "@/context/KuroContext";
import { JackpotRound, KuroParticipant, Round } from "@/types/round";
import {
  convertTimestampToDateTime,
  convertWeiToEther,
  formatEthereumAddress,
} from "@/utils/string";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getTotalUserEntries } from "@/views/magic-earn/RoundHistory";
import Link from "next/link";

export const findPlayerByAddress = (
  round: Round,
  address: string,
): KuroParticipant | undefined => {
  return round.participants.find(
    (player) => player.address.toLowerCase() === address.toLowerCase(),
  );
};

export const calculateWinLeverage = (
  round: Round,
  player: KuroParticipant | undefined,
) => {
  if (!player) return 0;
  const totalDeposit = Number(convertWeiToEther(round.totalValue));
  const playerDeposit = Number(
    convertWeiToEther(getTotalUserEntries(round, player.address).toString()),
  );

  if (totalDeposit === 0 || playerDeposit === 0) {
    return 0;
  }

  return (totalDeposit / playerDeposit).toFixed(2);
};

const JackpotHistoryTable = ({ type = "all" }: { type: "youWin" | "all" }) => {
  const {
    refetchJackpotHistories,
    isFetchingJackpotHistory,
    allJackpotHistories,
    myJackpotHistories,
  } = useKuro();

  const [jackpotRoundHistory, setJackpotRoundHistory] = useState<
    JackpotRound[]
  >([]);
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { address } = useAppKitAccount();

  useEffect(() => {
    if (type === "all") {
      setJackpotRoundHistory(allJackpotHistories?.data || []);
      setTotalPages(Math.ceil((allJackpotHistories?.total || 0) / limit));
    } else {
      setJackpotRoundHistory(myJackpotHistories?.data || []);
      setTotalPages(Math.ceil((myJackpotHistories?.total || 0) / limit));
    }
  }, [allJackpotHistories, myJackpotHistories]);

  useEffect(() => {
    refetchJackpotHistories(page, limit, type);
  }, [page, address, type]);

  return (
    <div className="w-full">
      <div className="rounded-md p-4">
        <Table className="rounded-xl">
          <TableHeader>
            <TableRow className="bg-card text-gray">
              <TableHead className="py-6">Rounds</TableHead>
              <TableHead className="py-6">Winner</TableHead>

              <TableHead className="py-6">Prize Pool</TableHead>
              <TableHead className="py-6 text-end">Time Ends</TableHead>
              <TableHead className="py-6 text-end">Status</TableHead>
              {type === "youWin" && <TableHead className="py-6"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingJackpotHistory && jackpotRoundHistory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={type === "youWin" ? 9 : 8}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <p>Loading...</p>
                </TableCell>
              </TableRow>
            ) : jackpotRoundHistory.length > 0 ? (
              jackpotRoundHistory.map((jackpotRound) => (
                <TableRow
                  key={jackpotRound.jackPotId}
                  className="transition hover:bg-[#3F367559]"
                >
                  <TableCell className="py-4 font-bold text-gray">
                    <div className="flex items-center">
                      {jackpotRound.roundId}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${jackpotRound.winner}`}
                        />
                        <AvatarFallback>WL</AvatarFallback>
                      </Avatar>
                      <p>{formatEthereumAddress(jackpotRound.winner)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="flex-1 py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Image
                        src="/images/monad_logo.svg"
                        alt="logo"
                        width={16}
                        height={16}
                      />
                      {convertWeiToEther(jackpotRound.totalPool)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-end gap-1">
                      <p className="font-medium text-gray">
                        {convertTimestampToDateTime(jackpotRound.endTime)} (UTC)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-end">
                    {jackpotRound.status === "Ended" &&
                    jackpotRound.txTransferred ? (
                      <Link
                        href={
                          "https://testnet.monadexplorer.com/tx/" +
                          jackpotRound.txTransferred
                        }
                        target="_blank"
                        className="text-accept hover:underline"
                      >
                        Confirmed
                      </Link>
                    ) : (
                      <p className="text-end text-warning">Processing</p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={type === "youWin" ? 9 : 8}
                  className="text-gray-500 h-24 text-center text-sm"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            Page {page} / {totalPages || 1} - Total {jackpotRoundHistory.length}{" "}
            results
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page <= 1 || isFetchingJackpotHistory}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : page)}
            disabled={page >= totalPages || isFetchingJackpotHistory}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JackpotHistoryTable;
