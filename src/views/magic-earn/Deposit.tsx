"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { parseEther, parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { YoloABIMultiToken } from "../../abi/YoloABI";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { PoolStatus, useKuro } from "@/context/KuroContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Divide } from "lucide-react";
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
} from "./TotalPlayer";
import { Divider } from "@mui/material";
import Button from "@/components/button";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState<string>("0.1");

  const { writeContractAsync: depositToken, isPending: isDepositing } =
    useWriteContract();
  const { writeContractAsync: approveToken, isPending: isApproving } =
    useWriteContract();
  const { writeContractAsync: setNativeToken } = useWriteContract();
  const { chainId } = useAccount();

  const { poolStatus, kuroData } = useKuro();
  const { address } = useAppKitAccount();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } =
    useAuth();

  const [selectedToken, setSelectedToken] =
    useState<SupportedTokenInfo | null>();
  const [unlimitedApproval, setUnlimitedApproval] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const { updateNativeBalance } = useAuth();

  const handleSetNativeToken = async () => {
    if (!address) {
      toast.error("Please connect wallet");
      return;
    }

    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Monad Testnet");
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
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (chainId !== somniaTestnet.id) {
      toast.error("Please switch to Monad Testnet");
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

  return (
    <div className="flex h-fit flex-col gap-6 rounded-xl bg-gradient-to-b from-[#1B5E9D73] to-[#43949A] px-6 py-6 pt-6 text-white">
      <div className="flex items-center">
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-normal opacity-50">Your Entries</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">
              {getUserEntries(address as string, kuroData)}
              <span className="text-sm opacity-50">
                /{getTotalEntries(kuroData)}
              </span>{" "}
              <span className="text-base">STT</span>
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-normal opacity-50">Your Win Chance</p>
          <p className="text-xl font-semibold">
            {calculateWinChance(address as string, kuroData) || "0%"}
          </p>
        </div>
      </div>
      <Divider className="bg-white/35" />

      <div className="">
        <p className="mb-2 font-semibold opacity-50">Input your entry</p>
        <Input
          className="placeholder:text-gray-500 !w-full !rounded-xl border !border-white/30 px-2 py-1 !text-[30px] font-semibold focus-visible:ring-transparent"
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

        <p className="mt-1 text-xs text-foreground opacity-50">
          {selectedToken &&
            `Minimum Value: ${convertWeiToEther(selectedToken.minDeposit) + " " + getTokenSymbolByAddress(selectedToken.address)}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {selectedToken?.address !==
          "0x0000000000000000000000000000000000000000" &&
          needsApproval() && (
            <div className="flex items-center gap-3">
              <Switch
                id="enable-feature"
                checked={unlimitedApproval}
                onCheckedChange={() => setUnlimitedApproval((prev) => !prev)}
              />
              <Label htmlFor="enable-feature">Unlimited Approval</Label>
            </div>
          )}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center gap-2 rounded-sm border border-white/50 bg-[#8371E940] px-2 py-1 text-xs transition-all hover:bg-[#8371E980] ${!address && "pointer-events-none opacity-50"}`}
          >
            <div className="flex flex-col gap-1 text-start font-medium">
              <span className="text-xs">
                Balance:{" "}
                {selectedToken
                  ? convertWeiToEther(selectedToken.balance) +
                    " " +
                    getTokenSymbolByAddress(selectedToken?.address)
                  : 0}
              </span>
            </div>
            {/* <ChevronsUpDown className="h-4 w-4 text-muted-foreground" /> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col gap-2 bg-[#8371E940] backdrop-blur-md"
            align="start"
          >
            {supportedTokens.length > 0 &&
              selectedToken &&
              supportedTokens.map((token) => (
                <DropdownMenuItem
                  key={token.address}
                  className={
                    token.address.toLowerCase() ===
                    selectedToken.address.toLowerCase()
                      ? "bg-primary"
                      : "bg-transparent"
                  }
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="flex items-center gap-2 text-white">
                    <div className="flex flex-col">
                      <span>{getTokenSymbolByAddress(token.address)}</span>
                    </div>
                  </div>
                  {token.address.toLowerCase() ===
                    selectedToken?.address.toLowerCase() && (
                    <Check className="ml-auto text-white" />
                  )}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {needsApproval() ? (
        <Button
          onClick={handleApproval}
          className="w-full"
          disabled={!depositAmount || isLoadingApproval}
        >
          {isLoadingApproval ? "Approving..." : "Approve"}
        </Button>
      ) : (
        <Button
          onClick={handleDeposit}
          className="w-full"
          disabled={
            !depositAmount ||
            isDepositing ||
            (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
              poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
          }
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default Deposit;
