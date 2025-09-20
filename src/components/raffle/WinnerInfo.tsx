// src/views/raffle/WinnerInfo.tsx
import React from 'react';
import Window from '@/views/home-v2/components/Window';
import RetroFrame from '@/components/ui/RetroFrame';
import { formatEthereumAddress } from '@/utils/string';
import { Address } from 'viem';
import styles from '@/styles/WinnerInfo.module.css';

type WinnerInfoProps = {
  winner?: Address;
};


const WinnerInfo = ({ winner }: WinnerInfoProps) => {
  let content;
  if (winner && winner !== '0x0000000000000000000000000000000000000000') {
    // Winner is a valid non-zero address
    content = <p className={`${styles.gifTextEffect} text-xl font-pixel-operator-mono-bold text-retro-gray-2`}>{formatEthereumAddress(winner)}</p>;
  } else {
    // Winner is undefined or null
    content = <p className={`${styles.gifTextEffect} text-xl font-pixel-operator-mono-bold text-retro-gray-2`}>A treasure beckons the victor</p>;
  }

  return (
    <Window title="🏆 WINNER 🏆" className='h-fit'>
      <div className="p-4 text-center">
        <RetroFrame title="▀▄▀▄▀ 𝐵𝑜𝑟𝑛 𝑡𝑜 𝓦𝓲𝓷 ▀▄▀▄▀ ">
        <p className="text-lg text-retro-gray-2 font-bold mb-4"><span className='text-retro-gray-2'>Winner's Address</span></p>
          {content}
        </RetroFrame>
      </div>
    </Window>
  );
};

export default WinnerInfo;