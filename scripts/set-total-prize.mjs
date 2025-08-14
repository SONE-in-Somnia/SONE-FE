// scripts/set-total-prize.mjs
import { ethers } from 'ethers';
import { KuroABI } from '../src/abi/KuroABI.js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

const {
  NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_KURO_CONTRACT_ADDRESS,
  OWNER_PRIVATE_KEY,
} = process.env;

// --- Validation ---
if (!NEXT_PUBLIC_RPC_URL) {
  throw new Error('NEXT_PUBLIC_RPC_URL is not defined in your .env.local file.');
}
if (!NEXT_PUBLIC_KURO_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_KURO_CONTRACT_ADDRESS is not defined in your .env.local file.');
}
if (!OWNER_PRIVATE_KEY) {
  throw new Error('OWNER_PRIVATE_KEY is not defined in your .env.local file.');
}

const newPrizeAmount = process.argv[2];
if (!newPrizeAmount) {
  throw new Error('Please provide the new prize amount as an argument. Example: node scripts/set-total-prize.mjs 1000000');
}

// --- Main Script Logic ---
async function main() {
  console.log('Connecting to the network...');
  const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_RPC_URL);
  
  console.log('Creating a wallet instance for the owner...');
  const ownerWallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
  
  console.log(`Connecting to the Kuro contract at: ${NEXT_PUBLIC_KURO_CONTRACT_ADDRESS}`);
  const kuroContract = new ethers.Contract(NEXT_PUBLIC_KURO_CONTRACT_ADDRESS, KuroABI, ownerWallet);

  console.log(`
Setting the total prize to: ${newPrizeAmount} STT`);
  
  // Convert the prize amount to its smallest unit (assuming 18 decimals)
  const prizeInSmallestUnit = ethers.parseUnits(newPrizeAmount, 18);
  
  console.log(`This will be sent to the contract as: ${prizeInSmallestUnit.toString()}`);

  try {
    const tx = await kuroContract.setTotalPrize(prizeInSmallestUnit);
    console.log('\nTransaction sent! Waiting for confirmation...');
    console.log(`Transaction Hash: ${tx.hash}`);
    
    await tx.wait();
    
    console.log('\n✅ Success! The total prize has been updated.');
    
    const updatedPrize = await kuroContract.totalPrize();
    console.log(`New prize value on contract: ${ethers.formatUnits(updatedPrize, 18)} STT`);

  } catch (error) {
    console.error('\n❌ Error setting the total prize:', error.message);
    process.exit(1);
  }
}

main();
