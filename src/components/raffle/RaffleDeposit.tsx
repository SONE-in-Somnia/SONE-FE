"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Check, ChevronsDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { somniaTestnet } from "@/config/chains";
import { RetroButton } from "@/components/RetroButton";
import Window from "@/views/home-v2/components/Window";
import { useQueryClient } from "@tanstack/react-query";
import { config } from "@/config";
import RaffleUserDeposit from "./RaffleUserDeposit";
import { useDepositInput } from "@/hooks/useDepositInput";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";
import PrizePoolABI from "@/abi/PrizePool.json";
import { useRaffle } from "@/context/RaffleContext";
import { RaffleStatus } from "@/types/raffle";
import { Address, parseEther, formatUnits } from "viem";
import { PrizePoolData } from '@/types/raffle'
import { ERC20ABI } from "@/abi/ERC20ABI";


const RaffleDeposit = ({ raffle }: { raffle: PrizePoolData }) => {
  const { depositDeadline, prizePoolAddress, userDeposit } = raffle;
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();
  const [estimatedUsdValue, setEstimatedUsdValue] = useState<number | null>(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);


  const { chainId } = useAccount();
  const { address, isConnected } = useAppKitAccount();
  const publicClient = usePublicClient();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } = useAuth();
  const queryClient = useQueryClient();
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const MOCK_STT_PRICE_USD = 0.10;

  const { 
    depositAmount,
    setDepositAmount,
    handleDeposit,
    isDepositing,
    handleWithdraw,
    isWithdrawing,
    handleApprove,
    isApproving,
    checkAllowance,
  } = useRaffle();
  const { isSuccess: isDepositConfirmed, isError: isDepositError } = useWaitForTransactionReceipt({ hash: depositTxHash, });
  const [userTokenBalance, setUserTokenBalance] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const currencySymbol = raffle.symbol;
  
  // validate deposit input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepositAmount(value);
    // basic validation
    if (parseFloat(value) <= 0) {
      setInputError('Amoutn must be greater than 0');
    } else {
      setInputError(null);
    }
  };

  // check allowance
  useEffect(() => {
    const getAllowance = async () => {
      if (raffle && isConnected) {
        const currentAllowance = await checkAllowance(raffle.prizePoolAddress);
        setAllowance(currentAllowance);
      }
    };
    getAllowance();
  }, [raffle, isConnected, checkAllowance]);

  // check approval
  const needsApproval = useMemo(() => {
    if (!depositAmount || !allowance) return false;
    const depositAmountWei = parseEther(depositAmount || "0");
    return allowance < depositAmountWei;
  }, [allowance, depositAmount]);
  
  // check deadlineDeposit
  useEffect(() => {
    const checkDeadline = () => {
      const now = Date.now() / 1000;
      const deadline = Number(depositDeadline);

      if (now > deadline) {
        setIsDeadlinePassed(true);
      } else {
        setIsDeadlinePassed(false);
      }
    };
    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);
    return () => clearInterval(interval);
  }, [depositDeadline]);

  // calculate est USD value
  useEffect(() => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && raffle.symbol === 'STT') {
      setEstimatedUsdValue(amount * MOCK_STT_PRICE_USD);
    } else {
      setEstimatedUsdValue(null);
    }
  }, [depositAmount, raffle.symbol]);

  // check deposit's success
  useEffect(() => {
    if (isDepositConfirmed) {
      toast.success("Deposit confirmed!");
      updateSupportedTokens();
      queryClient.invalidateQueries({ queryKey: ['roundData', address] });
      setDepositTxHash(undefined);
    }
  }, [isDepositConfirmed, queryClient, address, updateSupportedTokens]);

  // catch deposit error
  useEffect(() => {
    if (isDepositError) {
      toast.error("Deposit confirmation failed.");
      setDepositTxHash(undefined);
    }
  }, [isDepositError]);

  // fetch the user's balance and the token's decimals
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!publicClient || !address || !raffle?.token) {
        setUserTokenBalance(0n);
        setTokenDecimals(18);
        return;
      }

      try {
        // fetch balance
        const balance = await publicClient.readContract({
          address: raffle.token,
          abi: ERC20ABI,
          functionName: 'balanceOf',
          args: [address],
        });
        setUserTokenBalance(balance as bigint);

        // Fetch decimals
        const decimals = await publicClient.readContract({
          address: raffle.token,
          abi: ERC20ABI,
          functionName: "decimals",
        });
        setTokenDecimals(decimals as number);
      } catch (err) {
        console.log("Failed to fetch token balance or decimals", err);
        setUserTokenBalance(0n);
        setTokenDecimals(18);
      }
    };

    fetchTokenData();
  }, [publicClient, address, raffle?.token]);

  // calculate percentage based on user's balance
  const handlePercentageClick = (percentage: number) => {
    if (userTokenBalance > 0n) {
      const balanceInEther = parseFloat(formatUnits(userTokenBalance, tokenDecimals));
      const amount = (balanceInEther * percentage) / 100;
      setDepositAmount(amount.toString());
    } else {
      toast.warning("You have no balance for this token.");
    }
  };

  return (
    <Window title="💰 DEPOSIT 💰" >
      <div className="flex flex-col h-full gap-4 p-4 justify-between text-retro-black">
        <div className="text-center text-retro-red text-sm mb-4">
          Note: Withdrawals are permitted only after the WinnerDrawn event has been completed following the initial deposit.
        </div>
        <div>
          <div className="flex justify-center text-sm mb-4 tracking-tighter">
            <RaffleUserDeposit userTotalDeposit={raffle.userDeposit} symbol={raffle.symbol} />
          </div>
        </div>
        <div className="flex-grow flex items-center gap-2">
          <Input
            className="text-left h-20 !border-none !text-[72px] !text-retro-black !placeholder:text-[72px] !placeholder:text-retro-black focus-visible:!ring-0 focus-visible:!ring-offset-0"
            placeholder="0"
            type="number"
            value={depositAmount}
            onChange={handleInputChange}
          />
          <span className="mt-10 text-[24px] font-bold">({currencySymbol})</span>
        </div>
        {inputError && <p className="text-red-500 text-xs mt-1">{inputError}</p>}
        <p className="text-retro-black">
          Est Value ($): {estimatedUsdValue !== null ? `${estimatedUsdValue.toFixed(2)}` : 'N/A'}
        </p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[10, 25, 50, 100].map((percentage) => (
            <RetroButton
              key={percentage}
              onClick={() => handlePercentageClick(percentage)}
              className="w-full"
              disabled={!isConnected || userTokenBalance === 0n}
            >
              {percentage}%
            </RetroButton>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">

        </div>
        {needsApproval ? (
          <RetroButton
            onClick={() => handleApprove(raffle.prizePoolAddress)}
            type="button"
            className="w-full"
            disabled={!depositAmount || isApproving || !! inputError || !isConnected}
          >
            {isApproving ? "Approving..." : "Approve"}
          </RetroButton>
        ) : (
              <>
                {raffle.status === RaffleStatus.COMPLETED ? (
                // If the raffle is fully completed (winner drawn)
                <RetroButton
                  onClick={() => handleWithdraw(raffle.prizePoolAddress)}
                  type='button'
                  className="w-full"
                  disabled={isWithdrawing || raffle.isUserWinner || !isConnected}
                >
                  {isWithdrawing ? "WITHDRAWING..." : "Withdraw"}
                </RetroButton>
                ) : (
                  // If the raffle is IN_PROGRESS
                  <RetroButton
                    onClick={() => handleDeposit(raffle.prizePoolAddress)}
                    type="button"
                    className="w-full"
                    disabled={
                      raffle.status !== RaffleStatus.IN_PROGRESS ||
                      isDeadlinePassed ||
                      !depositAmount ||
                      isDepositing ||
                      !!inputError ||
                      !isConnected
                    }
                  >
                    {isDeadlinePassed ? "Entries Closed" : "Deposit"}
                  </RetroButton>
                )}
              </>
            )}
      </div>
    </Window>
  );
};

export default RaffleDeposit;