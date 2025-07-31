import React, { useEffect } from "react";
import Button from "@/components/button";
import { useKuro } from "@/context/KuroContext";
import { Round } from "@/types/round";
import { getTotalUserEntries } from "./RoundHistory";

interface WithdrawButtonProps {
  round: Round;
  onSuccess?: () => void;
  className?: string;
  label?: string;
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({
  round,
  onSuccess,
  className,
  label = "Withdraw",
}) => {
  const { handleWithdraw } = useKuro();

  const getDeposits = (round: Round) => {
    const userDeposits: bigint[] = [];

    round.participants.map((p) =>
      p.deposits.map((d) => {
        userDeposits.push(BigInt(d.amount));
        return d.amount;
      }),
    );

    return userDeposits;
  };

  useEffect(() => {
    console.log(getDeposits(round), round.roundId);
  }, [round]);

  return (
    <Button
      onClick={() =>
        handleWithdraw(
          round.roundId,
          getDeposits(round),
          round?.kuroContractAddress,
        )
      }
      className={className}
    >
      {label}
    </Button>
  );
};

export default WithdrawButton;
