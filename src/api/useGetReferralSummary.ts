import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ReferralSummary } from "@/types";

const getReferralSummary = async (address: string): Promise<ReferralSummary> => {
    const path = `/api/referral/summary/${address}`;
    const { data } = await axiosInstance.get(path);
    return data.data;
};

const useGetReferralSummary = (address: string) => {
    return useQuery({
        queryKey: ["referralSummary", address],
        queryFn: () => getReferralSummary(address),
        enabled: !!address,
    });
};

export default useGetReferralSummary;
