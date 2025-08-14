// src/api/useGetRaffleHistory.ts
import { useState, useEffect } from 'react';

// This is mock data. In a real application, you would fetch this from an API.
const mockRaffleHistory = [
  { id: 1, winner: '0x123...abc', prize: '500 STT', date: '2025-08-05' },
  { id: 2, winner: '0x456...def', prize: '750 STT', date: '2025-07-29' },
  { id: 3, winner: '0x789...ghi', prize: '600 STT', date: '2025-07-22' },
];

export const useGetRaffleHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API
    const timer = setTimeout(() => {
      setHistory(mockRaffleHistory);
      setLoading(false);
    }, 1200); // 1.2 second delay

    return () => clearTimeout(timer);
  }, []);

  return { history, loading };
};
