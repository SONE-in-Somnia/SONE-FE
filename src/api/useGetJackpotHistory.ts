// src/api/useGetJackpotHistory.ts
import { useQuery } from "@tanstack/react-query";
import { JackpotRound, RoundHistoryResponse } from "@/types/round";
import axiosInstance from "@/lib/axios";

const getJackpotHistory = async (body: {
  page?: number;
  type: "youWin" | "all";
  limit?: number;
  address?: string;
}): Promise<RoundHistoryResponse<JackpotRound>> => {
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
};

export const useGetJackpotHistory = (body: {
    page?: number;
    type: "youWin" | "all";
    limit?: number;
    address?: string;
}) => {
    return useQuery({
        queryKey: ["jackpot-history", body],
        queryFn: () => getJackpotHistory(body),
    });
};