// src/components/raffle/TicketPurchase.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useDepositForRaffle } from '@/api/useDepositForRaffle';
import { useGetUserTotalDeposit } from '@/api/useGetUserTotalDeposit';
import Window from '@/views/home-v2/components/Window';
import { RetroButton } from '@/components/RetroButton';
import { formatUnits, parseUnits } from 'viem';

// TODO: Add NEXT_PUBLIC_STT_TOKEN_ADDRESS and NEXT_PUBLIC_STT_USD_PRICE to your .env.local file
const STT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_STT_TOKEN_ADDRESS || '0xYourSttTokenAddressHere'; // IMPORTANT: Replace with actual address
const STT_USD_PRICE = parseFloat(process.env.NEXT_PUBLIC_STT_USD_PRICE || '0.50'); // Placeholder price: 1 STT = $0.50

const RaffleDeposit = ({ raffle }: { raffle: any }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [estimatedUsdValue, setEstimatedUsdValue] = useState<number | null>(null);
  const { address } = useAccount();
  
  const { data: balance } = useBalance({
    address,
    token: STT_TOKEN_ADDRESS as `0x${string}`,
  });

  const { formattedTotalDeposit } = useGetUserTotalDeposit();
  const { deposit, isDepositing } = useDepositForRaffle();

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    const amountInSmallestUnit = parseUnits(depositAmount, 18); // Assuming 18 decimals for STT
    await deposit(raffle.id, amountInSmallestUnit);
  };

  const handleAmountChange = (amount: string) => {
    if (amount === '' || parseFloat(amount) < 0) {
      setDepositAmount('');
      setEstimatedUsdValue(null);
      return;
    }
    setDepositAmount(amount);
    setEstimatedUsdValue(parseFloat(amount) * STT_USD_PRICE);
  };

  const handlePercentageClick = (percentage: number) => {
    if (balance) {
      const userBalance = parseFloat(formatUnits(balance.value, balance.decimals));
      const amountToSpend = userBalance * (percentage / 100);
      handleAmountChange(amountToSpend.toFixed(4));
    }
  };

  const formattedBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2) : '0.00';

  return (
    <Window title="💰 Deposit 💰" className='h-fit'>
      <div className="">
        <div className="flex justify-between text-sm mb-4">
          <div className="bg-retro-gray-3 text-retro-black px-2 py-1 border border-retro-gray-4">
            Total Deposit: {formattedTotalDeposit} STT
          </div>
          <div className="bg-retro-gray-3 text-retro-black px-2 py-1 border border-retro-gray-4">
            Balance: {formattedBalance} STT
          </div>
        </div>
        <div className="text-center mb-6">
          <input
            type="number"
            min="0"
            value={depositAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="bg-transparent text-5xl text-center w-full outline-none font-pixel-operator-mono-bold"
            placeholder="0"
          />
          <p className="text-retro-black">
            Est Value ($): {estimatedUsdValue !== null ? `${estimatedUsdValue.toFixed(2)}` : '~'}
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[10, 25, 50, 100].map((percentage) => (
            <RetroButton
              key={percentage}
              onClick={() => handlePercentageClick(percentage)}
              className="w-full"
            >
              {percentage}%
            </RetroButton>
          ))}
        </div>

        <RetroButton
          onClick={handleDeposit}
          className="w-full text-xl py-3"
        >
          {isDepositing ? 'Processing...' : `Deposit`}
        </RetroButton>
      </div>
    </Window>
  );
};

export default RaffleDeposit;





