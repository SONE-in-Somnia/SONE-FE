// src/components/raffle/TicketPurchase.tsx
import React from 'react';
import { useBuyRaffleTickets } from '@/api/useBuyRaffleTickets';
import Window from '@/views/home-v2/components/Window';
import { RetroButton } from '@/components/RetroButton';

const TicketPurchase = ({ raffle }: { raffle: any }) => {
  const [ticketCount, setTicketCount] = React.useState(1);
  const { buyTickets, isBuying } = useBuyRaffleTickets();

  const handleBuyTickets = async () => {
    await buyTickets(raffle.id, ticketCount);
  };

  return (
    <Window title="💰 BUY TICKETS 💰" className='h-fit'>
      <div className="p-4">
        <p className="mb-4 font-bold">Ticket Price: <span className="font-pixel-operator-mono-bold">{raffle.ticketPrice} FUKU</span></p>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="number"
            min="1"
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.max(1, Number(e.target.value)))}
            className="bg-white border-2 border-retro-gray-3 w-28 text-center p-2 font-pixel-operator-mono"
            disabled={isBuying}
          />
          <p className="font-bold">Total: <span className="font-pixel-operator-mono-bold">{ticketCount * raffle.ticketPrice} FUKU</span></p>
        </div>
        <RetroButton
          onClick={handleBuyTickets}
          disabled={isBuying}
          className="w-full"
        >
          {isBuying ? 'Processing...' : `Buy ${ticketCount} Ticket(s)`}
        </RetroButton>
      </div>
    </Window>
  );
};

export default TicketPurchase;
