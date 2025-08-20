// src/components/raffle/RaffleCardActions.tsx
import React from 'react';
import { RetroButton } from '@/components/RetroButton';

const RaffleCardActions = ({ handleParticipateClick, isCompleted }: { handleParticipateClick: () => void, isCompleted: boolean }) => (
  <div className="mt-auto">
    <RetroButton
      onClick={handleParticipateClick}
      className="w-full"
      disabled={isCompleted}
    >
      {isCompleted ? 'View Results' : 'Participate'}
    </RetroButton>
  </div>
);

export default RaffleCardActions;
