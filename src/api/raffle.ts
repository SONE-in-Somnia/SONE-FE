// src/api/raffle.ts
import { Raffle } from '@/types/raffle';
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

export const getRaffles = async (): Promise<Raffle[]> => {
  // This is a placeholder. In a real application, you would likely have a factory contract
  // or an off-chain service that provides a list of all raffles.
  // For now, we will return a single raffle based on the KURO_CONTRACT_ADDRESS.
  const raffle = await getRaffleById(KURO_CONTRACT_ADDRESS);
  return raffle ? [raffle] : [];
};

export const getRaffleById = async (id: string | number): Promise<Raffle | undefined> => {
  try {
    const provider = getProvider();
    const contract = getKuroContract(provider);

    // The PrizePool ABI doesn't have a concept of multiple raffles, so we'll treat the contract
    // itself as a single raffle. The 'id' will be the contract address.
    if (id.toString().toLowerCase() !== KURO_CONTRACT_ADDRESS.toLowerCase()) {
      return undefined;
    }

    const [title, prize, endsAt, ticketsSold, ticketPrice, prizePool, status] = await Promise.all([
      contract.name(),
      contract.token(), // Using the token address as the prize for now
      contract.drawTime(),
      contract.totalDeposits(),
      ethers.parseEther('0.1'), // Placeholder ticket price
      // contract.totalPrize(), // TODO: Uncomment this for production
      ethers.parseEther('1234'), // Hardcoded for UI development
      contract.getWinner().then((winner: string) => winner === ethers.ZeroAddress ? 'in-progress' : 'completed'),
    ]);

    return {
      id: KURO_CONTRACT_ADDRESS,
      title,
      prize,
      endsAt: new Date(Number(endsAt) * 1000).toISOString(),
      ticketsSold: Number(ticketsSold),
      ticketPrice: Number(ethers.formatEther(ticketPrice)),
      prizePool: Number(ethers.formatEther(prizePool)),
      status,
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
