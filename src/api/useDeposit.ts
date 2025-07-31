import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useProcessDeposit = () => {
    return useMutation({
        mutationKey: ['PROCESS_DEPOSIT'],
        mutationFn: async (params: {
            amount: number;
            txHash: string;
            token: string;
            poolAddress: string;
        }) => {
            const res = await axiosInstance.post('/api/events/deposit', params);
            return res.data;
        },
    });
};

export const useGetDepositStats = () => {
    return useQuery({
        queryKey: ['DEPOSIT_STATS'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/events/deposit/stats');
            return res.data;
        },
    });
}; 