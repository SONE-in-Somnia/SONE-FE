
import { useState, useEffect } from "react";
import { SupportedTokenInfo } from "@/types/round";
import { convertWeiToEther } from "@/utils/string";

export const useDepositInput = (selectedToken: SupportedTokenInfo | null) => {
  const [depositAmount, setDepositAmount] = useState<string>("0.1");
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedToken) {
      const amount = parseFloat(depositAmount);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    // Prevent negative numbers by replacing the minus sign
    rawValue = rawValue.replace("-", "");

    if (!/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
      return;
    }
    if (rawValue === "0" && depositAmount === "") {
      setDepositAmount("0");
      return;
    }
    if (rawValue.startsWith(".")) {
      rawValue = "0" + rawValue;
    }
    if (rawValue.length > 1 && rawValue[0] === "0" && rawValue[1] !== ".") {
      rawValue = rawValue.substring(1);
    }
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 6) {
        parts[1] = parts[1].substring(0, 6);
        rawValue = parts.join(".");
      }
    }
    setDepositAmount(rawValue);
  };

  return {
    depositAmount,
    setDepositAmount,
    inputError,
    handleInputChange,
  };
};
