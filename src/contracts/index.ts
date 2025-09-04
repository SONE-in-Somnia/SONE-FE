
import PrizePoolManager from '@/abi/PrizePoolManager.json';
import PrizePool from '@/abi/PrizePool.json';
import ERC20 from '@/abi/ERC20.json';
import { ERC20ABI } from '@/abi/ERC20ABI';

export const prizePoolManagerAddress = '0xCB3Aa1464AcE469294B3108Ec690560d61261440' as `0x${string}`;

export const prizePoolManager = {
  address: prizePoolManagerAddress,
  abi: PrizePoolManager,
};

export const prizePool = {
  abi: PrizePool,
};

export const erc20 = {
  abi: ERC20,
};
