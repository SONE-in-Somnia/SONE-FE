import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ReferralData } from "@/types";

interface GetReferralParams {
    address: string;
    page: number;
    limit: number;
}

const getReferral = async ({ address, page, limit }: GetReferralParams): Promise<ReferralData> => {
    const path = `/api/referral/user/${address}`;
    const { data } = await axiosInstance.get(path, { params: { page, limit } });
    return data.data; 
};

const useGetReferral = (params: GetReferralParams) => {
    return useQuery({
        queryKey: ["referral", params.address],
        queryFn: () => getReferral(params),
        enabled: !!params.address,
    });
};

export default useGetReferral;