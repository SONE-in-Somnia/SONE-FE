import { useQuery } from "@tanstack/react-query"
import request, { gql } from "graphql-request"

const useGetRecentActivity = () => {
  return useQuery({
    queryKey: ["GET_RECENT_ACTIVITY"],
    queryFn: async () => {
      const url = process.env.NEXT_PUBLIC_THE_GRAPH || ""
      const query = gql`{
  recentActivities(first: 4, orderBy: timestamp, orderDirection: desc) {
    user
    amount
    timestamp
    transactionHash
  }
}
`
      try {
        // const res: any = await request({
        //   url: url,
        //   document: query,
        //   requestHeaders: {
        //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        //   },
        // })
        return []
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        return [];
      }
    },
    // Thêm staleTime để chỉ fetch lại sau 15 phút
    staleTime: 15 * 60 * 1000, // 15 phút
    // Thêm cacheTime để cache dữ liệu lâu hơn
    gcTime: 24 * 60 * 60 * 1000, // 24 giờ
    // Thêm retry để thử lại nếu request thất bại
    retry: 2,
    // Không tự động fetch khi focus lại window
    refetchOnWindowFocus: false,
    // Không tự động fetch khi kết nối lại mạng
    refetchOnReconnect: false,
    // Không tự động fetch khi mount lại component
    refetchOnMount: false,
  })
}

export default useGetRecentActivity;