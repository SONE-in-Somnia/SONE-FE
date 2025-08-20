// src/api/raffle.ts
import { PoolType } from '@/types/raffle';
import { ethers } from 'ethers';
import { KuroABI } from '@/abi/KuroABI';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const KURO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KURO_CONTRACT_ADDRESS || '0x...';

const getProvider = () => {
  // In a real application, you would get the provider from the user's wallet (e.g., MetaMask)
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
};

const getKuroContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(KURO_CONTRACT_ADDRESS, KuroABI, providerOrSigner);
};

export const getRaffles = async (): Promise<PoolType[]> => {
  // This is a placeholder. In a real application, you would likely have a factory contract
  // or an off-chain service that provides a list of all raffles.
  // For now, we will return a single raffle based on the KURO_CONTRACT_ADDRESS.
  const raffle = await getRaffleById(KURO_CONTRACT_ADDRESS);
  return raffle ? [raffle] : [];
};

export const getRaffleById = async (id: string): Promise<PoolType | undefined> => {
  try {
    const provider = getProvider();
    const contract = getKuroContract(provider);

    if (id.toLowerCase() !== KURO_CONTRACT_ADDRESS.toLowerCase()) {
      return undefined;
    }

    const [name, symbol, depositDeadline, drawTime, tokenAddress, totalDeposits, winner] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.depositDeadline(),
      contract.drawTime(),
      contract.token(),
      contract.totalDeposits(),
      contract.getWinner(),
    ]);

    const status = winner === ethers.ZeroAddress ? "INPROCESS" : "COMPLETED";

    return {
      id: KURO_CONTRACT_ADDRESS,
      depositDeadline: new Date(Number(depositDeadline) * 1000).toISOString(),
      name,
      poolAddress: KURO_CONTRACT_ADDRESS as `0x${string}`,
      symbol,
      startTime,
      drawTime: new Date(Number(drawTime) * 1000).toISOString(),
      tokenAddress,
      status,
      totalDeposits: ethers.formatEther(totalDeposits),
      participantCount,
      winner,
    };
  } catch (error) {
    console.error('Error fetching raffle data:', error);
    return undefined;
  }
};

export const depositForRaffle = async (raffleId: string, depositAmount: bigint, signer: ethers.Signer): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    const contract = getKuroContract(signer);

    const tx = await contract.deposit({ value: depositAmount });
    await tx.wait();

    return { success: true, txHash: tx.hash };
  } catch (error: any) {
    console.error('Error depositing for raffle:', error);
    return { success: false, error: error.message };
  }
};
