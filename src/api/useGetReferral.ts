import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useGetReferral = () => {
    return useMutation({
        mutationKey: ["GET_REFERRAL"],
        mutationFn: async (body: { address: string, page: number, limit: number }) => {
            const path = '/api/referral/user/' + body.address
            const res = await axiosInstance.post(path, { page: body.page, limit: body.limit })
            return res.data
        }
    })
}

export default useGetReferral;