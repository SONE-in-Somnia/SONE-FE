
import { useState, useEffect } from "react";
import { SupportedTokenInfo } from "@/types/round";

export const useTokenSelection = (
  supportedTokens: SupportedTokenInfo[],
  isConnected: boolean,
) => {
  const [selectedToken, setSelectedToken] = useState<SupportedTokenInfo | null>(
    null,
  );

  useEffect(() => {
    if (isConnected && supportedTokens.length > 0) {
      if (selectedToken) {
        const selectedIndex = supportedTokens.find(
          (token) =>
            token.address.toLowerCase() ===
            selectedToken.address.toLowerCase(),
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
  }, [supportedTokens, selectedToken, isConnected, setSelectedToken]);

  return {
    selectedToken,
    setSelectedToken,
  };
};
