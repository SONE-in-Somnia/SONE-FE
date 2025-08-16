// src/api/useGetLeaderboard.ts
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@/types";

const getLeaderboard = async (): Promise<Player[]> => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    if (!apiHost) {
        throw new Error("API Host is not defined in your .env file.");
    }
    const { data } = await axiosInstance.get(`${apiHost}/point/leaderboard`);
    return data;
};

const useGetLeaderboard = () => {
    return useQuery({
        queryKey: ["leaderboard"],
        queryFn: getLeaderboard,
        // Optional: Refetch the data every 30 seconds to keep it fresh
        refetchInterval: 30000,
    });
};

export default useGetLeaderboard;
