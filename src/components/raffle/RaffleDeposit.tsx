"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { PoolStatus, useKuro } from "@/context/KuroContext";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { config } from "@/config";
import RaffleUserDeposit from "./RaffleUserDeposit";
import { useTokenDeposit } from "@/hooks/useTokenDeposit";
import { useDepositInput } from "@/hooks/useDepositInput";
import { useTokenSelection } from "@/hooks/useTokenSelection";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";
import PrizePoolABI from "@/abi/PrizePool.json";
import { YoloABIMultiToken } from "@/abi/YoloABI";

const RaffleDeposit = ({ depositDeadline, prizePoolAddress }: { depositDeadline: string, prizePoolAddress: `0x${string}` }) => {
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();
  const [estimatedUsdValue, setEstimatedUsdValue] = useState<number | null>(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  const { chainId } = useAccount();
  const { poolStatus, kuroData } = useKuro();
  const { address, isConnected } = useAppKitAccount();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } = useAuth();
  const queryClient = useQueryClient();

  const { selectedToken, setSelectedToken } = useTokenSelection(supportedTokens, isConnected);
  const { depositAmount, setDepositAmount, inputError, handleInputChange } = useDepositInput(selectedToken);
  const {
    handleDeposit,
    handleApproval,
    needsApproval,
    isDepositing,
    isApproving,
    unlimitedApproval,
    setUnlimitedApproval,
  } = useTokenDeposit({
    contractAddress: prizePoolAddress,
    contractAbi: PrizePoolABI.abi,
    depositFunctionName: "deposit",
    selectedToken: selectedToken,
    depositAmount: depositAmount,
    onSuccess: (txHash) => {
      setDepositTxHash(txHash as `0x${string}`);
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['roundData', kuroData?.roundId, address] });
      setDepositTxHash(undefined);
    }
  }, [isDepositConfirmed, queryClient, kuroData?.roundId, address, updateSupportedTokens]);

  useEffect(() => {
    if (isDepositError) {
      toast.error("Deposit confirmation failed.");
      setDepositTxHash(undefined);
    }
  }, [isDepositError]);

  const handleDepositWrapper = async () => {
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

  const { data: roundData } = useQuery({
    queryKey: ['roundData', kuroData?.roundId, address],
    queryFn: () => readContract(config, {
      abi: YoloABIMultiToken,
      address: process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
      functionName: 'getRoundData',
      args: [BigInt(kuroData!.roundId), address as `0x${string}`],
    }),
    refetchInterval: 5000,
    enabled: !!kuroData?.roundId && !!address,
  });

  const userDeposit = roundData ? (() => {
    const userIndex = roundData[1].findIndex((participant: string) => participant.toLowerCase() === address?.toLowerCase());
    if (userIndex !== -1) {
      return convertWeiToEther(roundData[2][userIndex]);
    }
    return '0';
  })() : '0';

  return (
    <Window title="💰 DEPOSIT 💰" >
      <div className="flex flex-col h-full gap-4 p-4 justify-between text-retro-black">
        <div>
          <div className="flex justify-center text-sm mb-4 tracking-tighter">
            <RaffleUserDeposit userTotalDeposit={userDeposit} symbol={currencySymbol} />
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
          <RetroButton
            onClick={handleDepositWrapper}
            type="button"
            className="w-full"
            disabled={
              isDeadlinePassed ||
              !depositAmount ||
              isDepositing ||
              !!inputError ||
              (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
                poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
            }
          >
            {isDeadlinePassed ? "Entries Closed" : "Deposit"}
          </RetroButton>
        )}
      </div>
    </Window>
  );
};

export default RaffleDeposit;