"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsDown } from "lucide-react";
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
import { useTokenDepositRaffle } from "@/hooks/useTokenDepositRaffle";
import { useDepositInput } from "@/hooks/useDepositInput";
import { useTokenSelectionRaffle } from "@/hooks/useTokenSelectionRaffle";
import { useWithdrawal } from "@/hooks/useWithdrawal";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";
import PrizePoolABI from "@/abi/PrizePool.json";
import { YoloABIMultiToken } from "@/abi/YoloABI";
import { useRaffle } from "@/context/RaffleContext";
import { RaffleStatus } from "@/types/raffle";
import { Address } from "viem";

const RaffleDeposit = ({ depositDeadline, prizePoolAddress, userTotalDeposit }: { depositDeadline: number, prizePoolAddress: Address, userTotalDeposit: string }) => {
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();
  const [estimatedUsdValue, setEstimatedUsdValue] = useState<number | null>(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  const { chainId } = useAccount();
  const { address, isConnected } = useAppKitAccount();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } = useAuth();
  const queryClient = useQueryClient();

  const { selectedRaffle } = useRaffle();

  const { selectedToken, setSelectedToken } = useTokenSelectionRaffle(supportedTokens, isConnected, selectedRaffle?.tokenAddress);
  const { depositAmount, setDepositAmount, inputError, handleInputChange } = useDepositInput(selectedToken);
  const {
    handleDeposit,
    handleApproval,
    needsApproval,
    isDepositing,
    isApproving,
    unlimitedApproval,
    setUnlimitedApproval,
  } = useTokenDepositRaffle({
    contractAddress: prizePoolAddress,
    contractAbi: PrizePoolABI.abi,
    selectedToken: selectedToken,
    depositAmount: depositAmount,
    onSuccess: (txHash) => {
      setDepositTxHash(txHash as `0x${string}`);
    },
  });

  const {
    handleWithdraw,
    isWithdrawing,
    hasWithdrawn,
    setHasWithdrawn,
  } = useWithdrawal({ prizePoolAddress });

  const MOCK_STT_PRICE_USD = 0.10;
  useEffect(() => {
      if (!isConnected) {
        setSelectedToken(null);
      }
    }, [isConnected, setSelectedToken]);

  useEffect(() => {
    const checkDeadline = () => {
      const now = Date.now() / 1000;
      if (now > Number(depositDeadline)) {
        setIsDeadlinePassed(true);
      }
    };
    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);
    return () => clearInterval(interval);
  }, [depositDeadline]);

  useEffect(() => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && selectedToken?.symbol === 'STT') {
      setEstimatedUsdValue(amount * MOCK_STT_PRICE_USD);
    } else {
      setEstimatedUsdValue(null);
    }
  }, [depositAmount, selectedToken]);

  const { isSuccess: isDepositConfirmed, isError: isDepositError } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  useEffect(() => {
    if (isDepositConfirmed) {
      toast.success("Deposit confirmed!");
      updateSupportedTokens();
      queryClient.invalidateQueries({ queryKey: ['roundData', address] });
      setDepositTxHash(undefined);
    }
  }, [isDepositConfirmed, queryClient, address, updateSupportedTokens]);

  useEffect(() => {
    if (isDepositError) {
      toast.error("Deposit confirmation failed.");
      setDepositTxHash(undefined);
    }
  }, [isDepositError]);

  const handleDepositWrapper = async () => {
    // --- DEBUG START ---
    console.log("--- Debugging Deposit ---");
    console.log("Address:", address);
    console.log("Chain ID:", chainId);
    console.log("Required Chain ID:", somniaTestnet.id);
    console.log("Selected Token:", selectedToken);
    
    // --- DEBUG END ---

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Somnia Testnet");
      return;
    }
    if (selectedToken && parseFloat(depositAmount) < parseFloat(convertWeiToEther(selectedToken.minDeposit))) {
      toast.warning("Deposit amount can't be less than " + convertWeiToEther(selectedToken.minDeposit));
      return;
    }
    if (selectedToken && parseFloat(depositAmount) > parseFloat(convertWeiToEther(selectedToken.balance))) {
      toast.warning("You don't have enough balance to deposit");
      return;
    }
    handleDeposit();
  };

  const currencySymbol = selectedToken ? getTokenSymbolByAddress(selectedToken.address) : "";

  const handlePercentageClick = (percentage: number) => {
    if (selectedToken) {
      const balance = parseFloat(convertWeiToEther(selectedToken.balance));
      const amount = (balance * percentage) / 100;
      setDepositAmount(amount.toString());
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
            <RaffleUserDeposit userTotalDeposit={userTotalDeposit} symbol={currencySymbol} />
            {selectedToken?.address !== NATIVE_TOKEN_ADDRESS && needsApproval() && (
              <div className="flex items-center gap-3">
                <Switch id="enable-feature" checked={unlimitedApproval} onCheckedChange={setUnlimitedApproval} />
                <Label htmlFor="enable-feature">Unlimited Approval</Label>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center text-retro-black gap-2 border border-retro-gray-4 bg-retro-gray-3 px-2 py-1 text-xs transition-all pointer-events-none`}
              >
                <div className="flex flex-col gap-1 text-start font-medium">
                  <span className="text-xs">
                    Balance:{" "}
                    {selectedToken
                      ? `${convertWeiToEther(selectedToken.balance)} ${getTokenSymbolByAddress(selectedToken?.address)}`
                      : 0}
                  </span>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
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
            >
              {percentage}%
            </RetroButton>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">

        </div>
        {needsApproval() ? (
          <RetroButton
            onClick={handleApproval}
            type="button"
            className="w-full"
            disabled={!depositAmount || isApproving || !!inputError}
          >
            {isApproving ? "APPROVING..." : "APPROVE"}
          </RetroButton>
        ) : (
          <> 
            {selectedRaffle?.winner ? (
              hasWithdrawn ? (
                <RetroButton type="button" className="w-full" disabled>
                  Entries Closed
                </RetroButton>
              ) : (
                <RetroButton
                  onClick={handleWithdraw}
                  type="button"
                  className="w-full"
                  disabled={isWithdrawing || parseFloat(userTotalDeposit) === 0} // Changed here
                >
                  {isWithdrawing ? "WITHDRAWING..." : "Withdraw"}
                </RetroButton>
              )
            ) : (
              <RetroButton
                onClick={handleDepositWrapper}
                type="button"
                className="w-full"
                // disabled={
                //   isDeadlinePassed ||
                //   !depositAmount ||
                //   isDepositing ||
                //   !!inputError ||
                //   (selectedRaffle?.status !== RaffleStatus.IN_PROGRESS)
                // }
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