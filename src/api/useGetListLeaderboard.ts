import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useGetListLeaderboard = () => {
    return useMutation({
        mutationKey: ["GET_LIST_LEADERBOARD"],
        mutationFn: async () => {
            const path = '/api/leaderboard/list'
            const res = await axiosInstance.get(path)
            return res.data
        }
    })
}

export default useGetListLeaderboard;