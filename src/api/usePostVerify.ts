import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface VerifyParams {
    address: string;
    signature: string;
    referralCode?: string;
}

const usePostVerify = () => {
    return useMutation({
        mutationFn: async (params: VerifyParams) => {
            const path = '/api/auth/verify-signature';
            const res = await axiosInstance.post(path, params);
            return res.data;
        }
    });
};

export default usePostVerify;