// src/types/raffle.ts

export interface Raffle {
  id: number;
  title: string;
  prize: string;
  endsAt: string; // ISO 8601 date string
  ticketsSold: number;
  ticketPrice: number;
  prizePool: number;
  status: 'in-progress' | 'completed';
}
