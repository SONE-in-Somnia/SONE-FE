
import { ERC20ABI } from "@/abi/ERC20ABI";
import { SupportedTokenInfo } from "@/types/round";
import { parseEther, parseUnits } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";
import { useAuth } from "@/context/AuthContext";

interface UseTokenDepositProps {
  contractAddress: `0x${string}`;
  contractAbi: any;
  depositFunctionName: string;
  selectedToken: SupportedTokenInfo | null;
  depositAmount: string;
  onSuccess?: (txHash: string) => void;
}

export const useTokenDeposit = ({
  contractAddress,
  contractAbi,
  depositFunctionName,
  selectedToken,
  depositAmount,
  onSuccess,
}: UseTokenDepositProps) => {
  const [unlimitedApproval, setUnlimitedApproval] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);

  const { writeContractAsync: depositToken, isPending: isDepositing } = useWriteContract();
  const { writeContractAsync: approveToken, isPending: isApproving } = useWriteContract();
  const { updateNativeBalance, updateSupportedTokens } = useAuth();


  const needsApproval = (): boolean => {
    if (!selectedToken || selectedToken.address === NATIVE_TOKEN_ADDRESS) {
      return false; // No approval needed for native token
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return false;
    }

    try {
      const requiredAmount = parseUnits(depositAmount, selectedToken.decimals);
      const currentAllowance = selectedToken.allowance || BigInt(0);

      if (unlimitedApproval) {
        const unlimitedThreshold = parseUnits("1000000000", selectedToken.decimals); // 1B tokens
        return currentAllowance < unlimitedThreshold;
      }

      return currentAllowance < requiredAmount;
    } catch {
      return false;
    }
  };

  const handleApproval = async () => {
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoadingApproval(true);
      let amount: bigint;

      if (unlimitedApproval) {
        amount = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      } else {
        amount = parseUnits(depositAmount, selectedToken.decimals);
      }

      const res = approveToken({
        abi: ERC20ABI,
        address: selectedToken.address as `0x${string}`,
        functionName: "approve",
        args: [contractAddress, amount],
      });

      await toast.promise(res, {
        pending: "Approval processing..",
        success: "Approval Success. 👌",
        error: "Approval failed. 🤯",
      }).then(async () => {
        await updateNativeBalance();
        await updateSupportedTokens();
      });
    } catch (error) {
      console.error("Error approving token:", error);
      toast.error("Approval failed");
    } finally {
      setIsLoadingApproval(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      let value = BigInt(0);
      let amountDepositing = BigInt(0);

      if (selectedToken.address === NATIVE_TOKEN_ADDRESS) {
        value = parseEther(depositAmount);
        amountDepositing = BigInt(0);
      } else {
        amountDepositing = parseUnits(depositAmount, selectedToken.decimals);
        value = BigInt(0);
      }

      const res = depositToken({
        abi: contractAbi,
        address: contractAddress,
        functionName: depositFunctionName,
        args: [selectedToken.address as `0x${string}`, amountDepositing],
        value: value,
      });

      toast.promise(res, {
        pending: "Deposit processing..",
        success: "Deposit Success. 👌",
        error: "Deposit failed. 🤯",
      }).then((txHash) => {
        if (onSuccess) {
          onSuccess(txHash);
        }
      });
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Deposit failed");
    }
  };

  return {
    handleDeposit,
    handleApproval,
    needsApproval,
    isDepositing,
    isApproving: isApproving || isLoadingApproval,
    unlimitedApproval,
    setUnlimitedApproval,
  };
};
