// src/api/useGetJackpotHistory.ts
import axiosInstance from "@/lib/axios";
import { JackpotRound, RoundHistoryResponse } from "@/types/round";
import { useMutation } from "@tanstack/react-query";

export const useGetJackpotHistory = () => {
  return useMutation({
    mutationKey: ["GET_JACKPOT_HISTORY"],
    mutationFn: async (body: {
      page?: number;
      type: "youWin" | "all";
      limit?: number;
      address?: string;
    }) => {
      let params: any = {
        page: body.page ? body.page : 1,
        limit: body.limit ? body.limit : 10,
      };

      if (body.type === "youWin") {
        if (body.address) {
          params.address = body.address;
        } else {
          return {
            data: [] as JackpotRound[],
            message: "No data available",
            page: 1,
            size: 10,
            success: true,
            total: 0,
          } as RoundHistoryResponse<JackpotRound>;
        }
      }

      const path = "/api/jackpot";
      const { data } = await axiosInstance.post(
        path,
        {
          ...params,
        },
        {
          timeout: 30000,
        }
      );
      return data;
    },
  });
};
