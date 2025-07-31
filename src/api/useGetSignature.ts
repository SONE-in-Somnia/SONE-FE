import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useRequestSignature = () => {
  return useMutation({
    mutationFn: async (address: string) => {
      const path = `/api/auth/request-signature/${address}`;
      const res = await axiosInstance.post(path);
      return res.data;
    },
  });
};

export default useRequestSignature;
