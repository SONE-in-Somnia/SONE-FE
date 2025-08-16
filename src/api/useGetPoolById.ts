// src/api/useGetPoolById.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { PoolType } from '@/data/types/pool.type';

const fetchPoolById = async (id: string): Promise<PoolType> => {
  const { data } = await axiosInstance.get(`/api/raffles/${id}`);
  return data;
};

export const useGetPoolById = (id: string) => {
  return useQuery({
    queryKey: ['pool', id], // Unique key for caching a single pool
    queryFn: () => fetchPoolById(id),
    enabled: !!id, // Only run the query if the id is available
  });
};
