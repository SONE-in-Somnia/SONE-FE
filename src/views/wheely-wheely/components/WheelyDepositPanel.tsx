
"use client";
import { Input } from "@/components/ui/input";
import { convertWeiToEther } from "@/utils/string";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { YoloABIMultiToken } from "../../../abi/YoloABI";
import { useAccount } from "wagmi";
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
import {
  calculateWinChance,
  getTotalEntries,
  getUserEntries,
} from "../../magic-earn/TotalPlayer";
import { RetroButton } from "@/components/RetroButton";
import RetroPanel from "@/components/customized/RetroPanel";
import { useTokenDeposit } from "@/hooks/useTokenDeposit";
import { useDepositInput } from "@/hooks/useDepositInput";
import { useTokenSelection } from "@/hooks/useTokenSelection";
import { NATIVE_TOKEN_ADDRESS } from "@/config/constants";

const WheelyDepositPanel = () => {
  const { chainId } = useAccount();
  const { poolStatus, kuroData } = useKuro();
  const { supportedTokens, getTokenSymbolByAddress, updateSupportedTokens } = useAuth();
  const { address, isConnected } = useAppKitAccount();

  const { selectedToken, setSelectedToken } = useTokenSelection(supportedTokens, isConnected);
  const { depositAmount, inputError, handleInputChange } = useDepositInput(selectedToken);
  const {
    handleDeposit,
    handleApproval,
    needsApproval,
    isDepositing,
    isApproving,
    unlimitedApproval,
    setUnlimitedApproval,
  } = useTokenDeposit({
    contractAddress: process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
    contractAbi: YoloABIMultiToken,
    depositFunctionName: "deposit",
    selectedToken: selectedToken,
    depositAmount: depositAmount,
    onSuccess: () => {
      updateSupportedTokens();
    },
  });

  useEffect(() => {
    if (!isConnected) {
      setSelectedToken(null);
    }
  }, [isConnected, setSelectedToken]);

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
            onChange={handleInputChange}
          />
          <span className="mt-10 text-[24px] font-bold">({currencySymbol})</span>
        </div>
        {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
        <p className="text-xs">
          {selectedToken && `Minimum Value: ${convertWeiToEther(selectedToken.minDeposit)} ${getTokenSymbolByAddress(selectedToken.address)}`}
        </p>
        <div className="flex items-center justify-between gap-3">
          {selectedToken?.address !== NATIVE_TOKEN_ADDRESS && needsApproval() && (
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
            onClick={handleDepositWrapper}
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
