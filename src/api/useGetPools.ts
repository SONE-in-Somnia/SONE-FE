import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from 'graphql-request'

const useGetPools = () => {
    return useQuery({
        queryKey: ["GET_POOLS"],
        // queryFn: async () => {
        //     const url = process.env.NEXT_PUBLIC_THE_GRAPH || ""
        //     const query = gql`{
        //         pools {
        //             id
        //             name
        //             name
        //             duration
        //             symbol
        //             drawTime
        //             depositDeadline
        //             totalDeposits
        //             status
        //         }
        //     }`

        //     try {
        //         const res: any = await request({
        //             url: url,
        //             document: query,
        //             requestHeaders: {
        //                 Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        //             },
        //         })
        //         return res.pools ? res.pools : []
        //     } catch (error) {
        //         console.error("Error fetching pools:", error);
        //         // Trả về mảng rỗng nếu có lỗi để tránh crash ứng dụng
        //         return [];
        //     }
        // },
        // // Thêm staleTime để chỉ fetch lại sau 15 phút
        // staleTime: 15 * 60 * 1000, // 15 phút
        // // Thêm cacheTime để cache dữ liệu lâu hơn
        // gcTime: 24 * 60 * 60 * 1000, // 24 giờ
        // // Thêm retry để thử lại nếu request thất bại
        // retry: 2,
        // // Không tự động fetch khi focus lại window
        // refetchOnWindowFocus: false,
        // // Không tự động fetch khi kết nối lại mạng
        // refetchOnReconnect: false,
        // // Không tự động fetch khi mount lại component
        // refetchOnMount: false,
        queryFn: async () => {
            const path = '/api/pools'
            const pool = await axiosInstance.get(path)
            return pool.data;
        },
        staleTime: 5 * 60 * 1000, // 5 phút
        refetchOnWindowFocus: false,
    })
}

export default useGetPools;