"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { parseEther, parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { YoloABIMultiToken } from "@/abi/YoloABI";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PoolStatus, useKuro } from "@/context/KuroContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, ChevronsDown } from "lucide-react";
import { SupportedTokenInfo } from "@/types/round";
import { ERC20ABI } from "@/abi/ERC20ABI";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { somniaTestnet } from "@/config/chains";
import Image from "next/image";
import {
  calculateWinChance,
  getTotalEntries,
  getUserEntries,
} from "@/views/magic-earn/TotalPlayer";
import { Divider } from "@mui/material";
import { RetroButton } from "@/components/RetroButton";
import RetroPanel from "@/components/customized/RetroPanel";
import Window from "@/views/home-v2/components/Window";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { config } from "@/config";

const RaffleDeposit = () => {
  const [depositAmount, setDepositAmount] = useState<string>("0.1");
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();
  const [estimatedUsdValue, setEstimatedUsdValue] = useState<number | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const { writeContractAsync: depositToken, isPending: isDepositing } =
    useWriteContract();
  const { writeContractAsync: approveToken, isPending: isApproving } =
    useWriteContract();
  const { writeContractAsync: setNativeToken } = useWriteContract();
  const { chainId } = useAccount();

  const { poolStatus, kuroData } = useKuro();
  const { address, isConnected } = useAppKitAccount(); // Get isConnected status
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } =
    useAuth();

  const [selectedToken, setSelectedToken] =
    useState<SupportedTokenInfo | null>();
  const [unlimitedApproval, setUnlimitedApproval] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const { updateNativeBalance } = useAuth();
  const queryClient = useQueryClient();

  const MOCK_STT_PRICE_USD = 0.10; // Mock price for STT

  useEffect(() => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && selectedToken?.symbol === 'STT') {
      setEstimatedUsdValue(amount * MOCK_STT_PRICE_USD);
    } else {
      setEstimatedUsdValue(null);
    }

    if (selectedToken) {
      const balance = parseFloat(convertWeiToEther(selectedToken.balance));
      if (amount > balance) {
        setInputError("Amount exceeds balance");
      } else {
        setInputError(null);
      }
    }
  }, [depositAmount, selectedToken]);


  // This effect watches for the connection status.
  // If the wallet disconnects, we clean up the component's internal state.
  useEffect(() => {
    if (!isConnected) {
      setSelectedToken(null);
    }
  }, [isConnected]);

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

  const handleSetNativeToken = async () => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Somnia Testnet");
      return;
    }

    try {
      await setNativeToken({
        abi: YoloABIMultiToken,
        address: process.env
          .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
        functionName: "setNativeTokenConfig",
        args: [true, parseUnits("0.01", 18), BigInt(10000)],
      });

      toast.success("Native token set successfully");
    } catch (error) {
      console.error("Error setting native token:", error);
      toast.error("Error setting native token");
    }
  };

  const needsApproval = (): boolean => {
    if (
      !selectedToken ||
      selectedToken.address === "0x0000000000000000000000000000000000000000"
    ) {
      return false;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return false;
    }

    try {
      const requiredAmount = parseUnits(depositAmount, selectedToken.decimals);
      const currentAllowance = selectedToken.allowance || BigInt(0);

      if (unlimitedApproval) {
        const unlimitedThreshold = parseUnits(
          "1000000000",
          selectedToken.decimals,
        );
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
        amount = BigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        );
      } else {
        amount = parseUnits(depositAmount, selectedToken.decimals);
      }

      const res = approveToken({
        abi: ERC20ABI,
        address: selectedToken.address as `0x${string}`,
        functionName: "approve",
        args: [process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS, amount],
      });

      await toast
        .promise(res, {
          pending: "Approval processing..",
          success: "Approval Success. 👌",
          error: "Approval failed. 🤯",
        })
        .then(async () => {
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
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Somnia Testnet");
      return;
    }

    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (
      parseFloat(depositAmount) <
      parseFloat(convertWeiToEther(selectedToken.minDeposit))
    ) {
      toast.warning(
        "Deposit amount can't be less than " +
        convertWeiToEther(selectedToken.minDeposit),
      );
      return;
    }

    if (
      parseFloat(depositAmount) >
      parseFloat(convertWeiToEther(selectedToken.balance))
    ) {
      toast.warning("You don't have enough balance to deposit");
      return;
    }

    try {
      let value = BigInt(0);
      let amountDepositing = BigInt(0);

      if (
        selectedToken.address === "0x0000000000000000000000000000000000000000"
      ) {
        value = parseEther(depositAmount);
        amountDepositing = BigInt(0);
      } else {
        amountDepositing = parseUnits(depositAmount, selectedToken.decimals);
        value = BigInt(0);
      }

      const res = depositToken({
        abi: YoloABIMultiToken,
        address: process.env
          .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
        functionName: "deposit",
        args: [selectedToken.address as `0x${string}`, amountDepositing],
        value: value,
      });

      toast
        .promise(res, {
          pending: "Deposit processing..",
          success: "Deposit sent successfully! Waiting for confirmation...",
          error: "Deposit failed to send. 🤯",
        })
        .then((txHash) => {
          setDepositTxHash(txHash);
        });
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Deposit failed");
    }
  };

  useEffect(() => {
    if (supportedTokens.length > 0) {
      if (selectedToken) {
        const selectedIndex = supportedTokens.find(
          (token) =>
            token.address.toLowerCase() === selectedToken.address.toLowerCase(),
        );
        if (selectedIndex) {
          setSelectedToken(selectedIndex);
        } else {
          setSelectedToken(supportedTokens[0]);
        }
      } else {
        setSelectedToken(supportedTokens[0]);
      }
    }
  }, [supportedTokens]);

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
            <div className="bg-retro-gray-3 text-retro-black px-2 py-1 border border-retro-gray-4">
              Your Deposit: {userDeposit} {currencySymbol}
            </div>
            {selectedToken?.address !== "0x0000000000000000000000000000000000000000" && needsApproval() && (
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
            onChange={(e) => setDepositAmount(e.target.value)}
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
            onClick={handleDeposit}
            type="button"
            className="w-full"
            disabled={
              !depositAmount ||
              isDepositing ||
              !!inputError ||
              (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
                poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
            }
          >
            Deposit
          </RetroButton>
        )}
      </div>
    </Window>
  );
};

export default RaffleDeposit;