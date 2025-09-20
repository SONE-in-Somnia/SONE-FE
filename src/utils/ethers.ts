// src/utils/ethers.ts
import { ethers } from 'ethers';

export const getProvider = () => {
  // In a real application, you would get the provider from the user's wallet (e.g., MetaMask)
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
};
