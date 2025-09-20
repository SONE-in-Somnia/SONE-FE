// src/components/raffle/RaffleCardTVL.tsx
import React from 'react';
import { PrizePoolData } from '@/types/raffle';
import styles from '@/styles/RaffleCardTVL.module.css';

type RaffleCardTVLProps = {
  totalDeposits: string;
  symbol: string;
};



const RaffleCardTVL = ({ totalDeposits, symbol }: RaffleCardTVLProps) => (
  <div className={`text-center ${styles.animatedBackground} border-2 border-t-black border-l-black border-b-white border-r-white p-4 mb-6`}>
    <p className="text-sm font-bold">Total Value Locked</p>
    <p className="text-xl text-center font-pixel-operator-mono-bold text-retro-gray-2 mt-3">{totalDeposits !== undefined ? totalDeposits.toLocaleString() : 'N/A'}</p>
    <p className='text-xl text-center font-pixel-operator-mono-bold text-retro-gray-2'>{ symbol || ''}</p>
  </div>
);

export default RaffleCardTVL;
