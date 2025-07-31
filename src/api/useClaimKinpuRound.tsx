import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useClaimKinpuRound = () => {
  return useMutation({
    mutationKey: ["KIMPU_CLAIM_ROUND"],
    mutationFn: async (body: { roundId: number; txHash: string }) => {
      const path = `/api/diddy/${body.roundId}/claim/`;
      const res = await axiosInstance.put(path, { txHash: body.txHash });
      return res.data;
    },
  });
};

export default useClaimKinpuRound;
