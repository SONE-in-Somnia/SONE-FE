import { parseEther } from "viem";
import { toast } from "react-toastify";
import { useWriteContract, useAccount } from "wagmi";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";
import { useAuth } from "@/context/AuthContext";
import { SupportedTokenInfo } from "@/types/round";
import { useGetRaffleDetailsWithFallback } from "@/api/useGetRaffleDetailsWithFallback"  

interface UseTokenDepositRaffleProps {
  contractAddress: `0x${string}`;
  contractAbi: any;
  selectedToken: SupportedTokenInfo | null;
  depositAmount: string;
  onSuccess?: (txHash: string) => void;
}

export const useTokenDepositRaffle = ({
  contractAddress,
  contractAbi,
  selectedToken,
  depositAmount,
  onSuccess,
}: UseTokenDepositRaffleProps) => {
  const { writeContractAsync: depositToken, isPending: isDepositing } = useWriteContract();
  const { updateNativeBalance } = useAuth();
  const { address } = useAccount();

  const {refetch: refetchRaffleDetails} = useGetRaffleDetailsWithFallback(contractAddress, address)

  const handleDeposit = async () => {
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (selectedToken.address !== NATIVE_TOKEN_ADDRESS) {
      toast.error("This pool only accepts the native token for deposits.");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const value = parseEther(depositAmount);

      const res = depositToken({
        abi: contractAbi,
        address: contractAddress,
        functionName: "deposit",
        args: [value],
        value: value,
      });

      toast.promise(res, {
        pending: "Deposit processing..",
        success: "Deposit Success. 👌",
        error: "Deposit failed. 🤯",
      }).then(async (txHash) => {
        await updateNativeBalance();
        refetchRaffleDetails(); 
        if (onSuccess) {
          onSuccess(txHash);
        }
      });
    } catch (error) {
      console.error("Error depositing:", error);
      const errorMessage = (error as any)?.shortMessage || "Deposit failed";
      toast.error(errorMessage);
    }
  };

  const needsApproval = () => false;
  const handleApproval = async () => {};

  return {
    handleDeposit,
    handleApproval,
    needsApproval,
    isDepositing,
    isApproving: false,
    unlimitedApproval: false,
    setUnlimitedApproval: () => {},
  };
};
