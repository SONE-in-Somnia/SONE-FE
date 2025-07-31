import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface ReferralSummary {
    totalReferrals: number;
    totalReferralPoints: number;
}

const useGetReferralSummary = () => {
    return useMutation({
        mutationKey: ["GET_REFERRAL_SUMMARY"],
        mutationFn: async (address: string): Promise<ReferralSummary> => {
            const path = `/api/referral/summary/${address}`;
            const res = await axiosInstance.get(path);
            return res.data.data;
        }
    });
};

export default useGetReferralSummary; 