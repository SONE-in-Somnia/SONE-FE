"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { parseEther, parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { YoloABIMultiToken } from "../../../abi/YoloABI";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
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
} from "../../magic-earn/TotalPlayer";
import { Divider } from "@mui/material";
import { RetroButton } from "@/components/RetroButton";
import RetroPanel from "@/components/customized/RetroPanel";

const WheelyDepositPanel = () => {
  const [depositAmount, setDepositAmount] = useState<string>("0.1");
  const [inputError, setInputError] = useState<string | null>(null);


  const { writeContractAsync: depositToken, isPending: isDepositing } =
    useWriteContract();
  const { writeContractAsync: approveToken, isPending: isApproving } =
    useWriteContract();
  const { writeContractAsync: setNativeToken } = useWriteContract();
  const { chainId } = useAccount();

  const { poolStatus, kuroData } = useKuro();
  const { address, isConnected } = useAppKitAccount();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } =
    useAuth();

  const [selectedToken, setSelectedToken] =
    useState<SupportedTokenInfo | null>();
  const [unlimitedApproval, setUnlimitedApproval] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const { updateNativeBalance } = useAuth();

  useEffect(() => {
    if (!isConnected) {
      setSelectedToken(null);
    }
  }, [isConnected]);

  useEffect(() => {
    const amount = parseFloat(depositAmount);
    if (selectedToken) {
      const balance = parseFloat(convertWeiToEther(selectedToken.balance));
      const minDeposit = parseFloat(convertWeiToEther(selectedToken.minDeposit));
      if (amount > balance) {
        setInputError("Insufficient balance");
      } else if (amount < minDeposit && amount !== 0) {
        setInputError(`Deposit can't be less than ${minDeposit}`);
      } else {
        setInputError(null);
      }
    }
  }, [depositAmount, selectedToken]);

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
      return false; // No approval needed for native MON
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return false;
    }

    try {
      const requiredAmount = parseUnits(depositAmount, selectedToken.decimals);
      const currentAllowance = selectedToken.allowance || BigInt(0);

      // If unlimited approval is enabled and we have a very large allowance, consider it sufficient
      if (unlimitedApproval) {
        // Check if we have unlimited approval (very large allowance)
        const unlimitedThreshold = parseUnits(
          "1000000000",
          selectedToken.decimals,
        ); // 1B tokens
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
        // Use maximum possible uint256 value for unlimited approval
        amount = BigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        );
      } else {
        // Use exact amount needed
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
    console.log("handleDeposit called");
    if (!address) {
      toast.error("Please connect your wallet");
      console.log("Deposit failed: No address");
      return;
    }

    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Somnia Testnet");
      console.log("Deposit failed: Wrong chainId", chainId);
      return;
    }

    if (!selectedToken) {
      toast.error("Please select a token");
      console.log("Deposit failed: No selected token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      console.log("Deposit failed: Invalid amount", depositAmount);
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
      console.log("Deposit failed: Amount too low");
      return;
    }

    if (
      parseFloat(depositAmount) >
      parseFloat(convertWeiToEther(selectedToken.balance))
    ) {
      toast.warning("You don't have enough balance to deposit");
      console.log("Deposit failed: Insufficient balance");
      return;
    }

    console.log("All checks passed, proceeding with deposit");
    try {
      let value = BigInt(0);
      let amountDepositing = BigInt(0);

      if (
        selectedToken.address === "0x0000000000000000000000000000000000000000"
      ) {
        // Native MON deposit
        value = parseEther(depositAmount);
        amountDepositing = BigInt(0); // Amount parameter should be 0 for MON
      } else {
        // ERC20 token deposit
        amountDepositing = parseUnits(depositAmount, selectedToken.decimals);
        value = BigInt(0); // No native value for ERC20 deposits
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
          success: "Deposit Success. 👌",
          error: "Deposit failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();
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

  return (
    <RetroPanel title="INPUT YOUR ENTRY" headerClassName="bg-green-700">
      <div className="flex flex-col gap-4 p-2 text-retro-black">
        <div>
          <p className="text-[16px]">Your Entries</p>
          <p className="text-[24px] font-bold">
            {getUserEntries(address as string, kuroData)}
            <span className="text-sm opacity-50">
              /{getTotalEntries(kuroData)}
            </span>{" "}
            <span className="text-base">{currencySymbol}</span>
          </p>
        </div>
        <div className="border-b-2 border-b-white pb-4">
          <p className="text-[16px]">Your Win Chance</p>
          <p className="text-[24px] font-bold">
            {calculateWinChance(address as string, kuroData) || "0%"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="h-20 !border-none !text-[72px] !text-retro-black !placeholder:text-[72px] !placeholder:text-retro-black focus-visible:!ring-0 focus-visible:!ring-offset-0"
            placeholder="0"
            type="number"
            value={depositAmount}
            onChange={(e) => {
              let rawValue = e.target.value;
              // Chỉ cho phép số và dấu thập phân
              if (!/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
                return;
              }

              // Xử lý trường hợp nhập số 0 đầu tiên
              if (rawValue === "0" && depositAmount === "") {
                setDepositAmount("0");
                return;
              }

              // Xử lý trường hợp bắt đầu bằng dấu chấm
              if (rawValue.startsWith(".")) {
                rawValue = "0" + rawValue;
              }

              // Ngăn nhiều số 0 ở đầu (ví dụ: 00123)
              if (
                rawValue.length > 1 &&
                rawValue[0] === "0" &&
                rawValue[1] !== "."
              ) {
                rawValue = rawValue.substring(1);
              }

              // Giới hạn số chữ số thập phân là 6
              if (rawValue.includes(".")) {
                const parts = rawValue.split(".");
                if (parts[1] && parts[1].length > 6) {
                  parts[1] = parts[1].substring(0, 6);
                  rawValue = parts.join(".");
                }
              }

              setDepositAmount(rawValue);
            }}
          />
          <span className="mt-10 text-[24px] font-bold">({currencySymbol})</span>
        </div>
        {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
        <p className="text-xs">
          {selectedToken && `Minimum Value: ${convertWeiToEther(selectedToken.minDeposit)} ${getTokenSymbolByAddress(selectedToken.address)}`
          }
        </p>
        <div className="flex items-center justify-between gap-3">
          {selectedToken?.address !== "0x0000000000000000000000000000000000000000" && needsApproval() && (
            <div className="flex items-center gap-3">
              <Switch id="enable-feature" checked={unlimitedApproval} onCheckedChange={() => setUnlimitedApproval((prev) => !prev)} />
              <Label htmlFor="enable-feature">Unlimited Approval</Label>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 border border-retro-black bg-transparent px-2 py-1 text-xs transition-all hover:bg-gray-200 ${!address && "pointer-events-none opacity-50"}`}
            >
              <div className="flex flex-col gap-1 text-start font-medium">
                <span className="text-xs">
                  Balance:{" "}
                  {selectedToken
                    ? `${convertWeiToEther(selectedToken.balance)} 
                    ${getTokenSymbolByAddress(selectedToken?.address)}`
                    : 0}
                </span>
              </div>
              <ChevronsDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 bg-transparent border-retro-black rounded-none"
              align="start"
            >
              {supportedTokens.length > 0 && 
                selectedToken &&
                supportedTokens.map((token) => (
                  <DropdownMenuItem
                    key={token.address}
                    className={
                      token.address.toLowerCase() ===
                        selectedToken?.address.toLowerCase()
                        ? "bg-gray-200"
                        : "bg-transparent"
                    }
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex items-center gap-2 text-retro-black">
                      <div className="flex flex-col">
                        <span>{getTokenSymbolByAddress(token.address)}</span>
                      </div>
                    </div>
                    {token.address.toLowerCase() ===
                      selectedToken?.address.toLowerCase() && (
                      <Check className="ml-auto text-retro-black" />
                    )}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
                poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
            }
          >
            SUBMIT
          </RetroButton>
        )}
      </div>
    </RetroPanel>
  );
};

export default WheelyDepositPanel;