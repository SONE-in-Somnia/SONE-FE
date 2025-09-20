import { useState } from "react";
import { useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import PrizePoolABI from "@/abi/PrizePool.json";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useAppKitAccount } from "@reown/appkit/react";

interface UseWithdrawalProps {
  prizePoolAddress: `0x${string}`;
}

export const useWithdrawal = ({ prizePoolAddress }: UseWithdrawalProps) => {
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  const { writeContractAsync: withdrawFunds, isPending: isWithdrawing } = useWriteContract();
  const queryClient = useQueryClient();
  const { updateSupportedTokens } = useAuth();
  const { address } = useAppKitAccount();

  const handleWithdraw = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const withdrawPromise = withdrawFunds({
        abi: PrizePoolABI.abi,
        address: prizePoolAddress,
        functionName: "withdraw",
      });

      toast.promise(withdrawPromise, {
        pending: "Withdrawal processing..",
        success: "Withdrawal Success. 👌",
        error: "Withdrawal failed. 🤯",
      }).then(() => {
        setHasWithdrawn(true);
        updateSupportedTokens();
        queryClient.invalidateQueries({ queryKey: ['roundData', address] });
      });
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error("Withdrawal failed");
    }
  };

  return {
    handleWithdraw,
    isWithdrawing,
    hasWithdrawn,
    setHasWithdrawn,
  };
};