import { useState, useEffect } from "react";
import { SupportedTokenInfo } from "@/types/round";
import { Address } from "viem"; // Import Address type

export const useTokenSelectionRaffle = (
  supportedTokens: SupportedTokenInfo[],
  isConnected: boolean,
  requiredTokenAddress?: Address, // New parameter
) => {
  const [selectedToken, setSelectedToken] = useState<SupportedTokenInfo | null>(
    null,
  );

  useEffect(() => {
    let tokensToConsider = supportedTokens;

    // Filter tokens if a requiredTokenAddress is provided
    if (requiredTokenAddress) {
      tokensToConsider = supportedTokens.filter(
        (token) => token.address.toLowerCase() === requiredTokenAddress.toLowerCase()
      );
    }

    if (isConnected && tokensToConsider.length > 0) {
      // If there's only one token after filtering, auto-select it
      if (tokensToConsider.length === 1) {
        setSelectedToken(tokensToConsider[0]);
        return;
      }

      // Existing logic for selecting a token
      if (selectedToken) {
        const selectedIndex = tokensToConsider.find(
          (token) =>
            token.address.toLowerCase() ===
            selectedToken.address.toLowerCase(),
        );
        if (selectedIndex) {
          setSelectedToken(selectedIndex);
        } else {
          // If previously selected token is not in filtered list, select the first available
          setSelectedToken(tokensToConsider[0]);
        }
      } else {
        setSelectedToken(tokensToConsider[0]);
      }
    } else if (!isConnected) {
      // Clear selected token if disconnected
      setSelectedToken(null);
    }
  }, [supportedTokens, selectedToken, isConnected, setSelectedToken, requiredTokenAddress]); // Add requiredTokenAddress to dependencies

  return {
    selectedToken,
    setSelectedToken,
  };
};