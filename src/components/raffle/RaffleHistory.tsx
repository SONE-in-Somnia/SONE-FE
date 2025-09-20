import React, { useState, useEffect } from 'react';
import Window from '@/views/home-v2/components/Window';
import { RaffleDetailsType } from '@/types/raffle';
import { format } from 'date-fns';
import { useWatchContractEvent } from 'wagmi';
import prizePoolAbi from '@/abi/PrizePool.json';
import { Address, formatUnits, decodeEventLog } from 'viem'; // Import decodeEventLog

interface RealtimeActivity {
  id: string;
  player: Address;
  amount: string;
  timestamp: number;
  type: 'deposit' | 'win';
  tokenSymbol?: string;
}

const RaffleHistory = ({ raffle }: { raffle: RaffleDetailsType }) => {
  const [realtimeActivities, setRealtimeActivities] = useState<RealtimeActivity[]>([]);

  const addActivity = (activity: RealtimeActivity) => {
    setRealtimeActivities((prev) => {
      const newActivities = [activity, ...prev];
      return newActivities.slice(0, 10);
    });

    setTimeout(() => {
      setRealtimeActivities((prev) => prev.filter((a) => a.id !== activity.id));
    }, 15000);
  };

  // Watch for Deposited events
  useWatchContractEvent({
    address: raffle.prizePoolAddress,
    abi: prizePoolAbi.abi as any,
    eventName: 'Deposited',
    onLogs: (logs) => {
      logs.forEach((log) => {
        try {
          const decodedLog = decodeEventLog({
            abi: prizePoolAbi.abi,
            data: log.data,
            topics: log.topics,
          });

          if (decodedLog.eventName === 'Deposited' && decodedLog.args) {
            const args = decodedLog.args as DepositedEventArgs; // Cast to specific args type
            if (args.user && args.amount) {
              const amount = formatUnits(args.amount, 18); // Assuming 18 decimals
              addActivity({
                id: `${log.transactionHash}-${log.logIndex}`,
                player: args.user,
                amount: amount,
                timestamp: Date.now(),
                type: 'deposit',
                tokenSymbol: 'ETH', // Placeholder, ideally fetch token symbol
              });
            }
          }
        } catch (e) {
          console.error("Error decoding Deposited log:", e);
        }
      });
    },
  });

  // Watch for Claimed events (considering them as wins)
  useWatchContractEvent({
    address: raffle.prizePoolAddress,
    abi: prizePoolAbi.abi as any,
    eventName: 'Claimed',
    onLogs: (logs) => {
      logs.forEach((log) => {
        try {
          const decodedLog = decodeEventLog({
            abi: prizePoolAbi.abi,
            data: log.data,
            topics: log.topics,
          });

          if (decodedLog.eventName === 'Claimed' && decodedLog.args) {
            const args = decodedLog.args as ClaimedEventArgs; // Cast to specific args type
            if (args.user && args.amount) {
              const amount = formatUnits(args.amount, 18); // Assuming 18 decimals
              addActivity({
                id: `${log.transactionHash}-${log.logIndex}`,
                player: args.user,
                amount: amount,
                timestamp: Date.now(),
                type: 'win',
                tokenSymbol: 'ETH', // Placeholder, ideally fetch token symbol
              });
            }
          }
        } catch (e) {
          console.error("Error decoding Claimed log:", e);
        }
      });
    },
  });

  const renderContent = () => {
    if (realtimeActivities.length === 0) {
      return <p className='font-bold'>No real-time activities yet.</p>;
    }
    return (
      <>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {realtimeActivities.map((item: RealtimeActivity) => (
            <div key={item.id} className="flex-shrink-0 w-80 bg-retro-gray-2 p-3 border-2 border-retro-gray-3">
              <p className="font-bold truncate">Address: <span className="font-pixel-operator-mono">{item.player}</span></p>
              {item.type === 'deposit' && (
                <p className="font-bold mt-1">Deposit: <span className="font-pixel-operator-mono-bold text-retro-purple relative top-0.5">{item.amount} {item.tokenSymbol}</span></p>
              )}
              {item.type === 'win' && (
                <p className="font-bold mt-1">Win: <span className="font-pixel-operator-mono-bold text-retro-green relative top-0.5">{item.amount} {item.tokenSymbol}</span></p>
              )}
              <p className="font-pixel-operator-mono text-xs text-right mt-3">{format(new Date(item.timestamp), 'PPpp')}</p>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Window title="📜 RAFFLE ACTIVITIES 📜" className='h-fit'>
      <div className='p-4'>
        {renderContent()}
      </div>
    </Window>
  );
};

export default RaffleHistory;