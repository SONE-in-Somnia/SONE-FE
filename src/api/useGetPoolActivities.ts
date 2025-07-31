import { useMutation } from "@tanstack/react-query"
import request, { gql } from "graphql-request"

type ActivityType = "DEPOSIT" | "CLAIM" | "DRAW" | "OWNERSHIP_TRANSFERRED" | "UPDATE_DRAW_TIME" | "UPDATE_DEPOSIT_DEADLINE" | "ALL";

interface GetPoolActivitiesParams {
    poolId?: string;
    user?: string;
    type?: ActivityType;
    limit?: number;
    skip?: number;
    orderDirection?: "asc" | "desc";
}

const useGetPoolActivities = () => {
    return useMutation({
        mutationKey: ["GET_POOL_ACTIVITIES"],
        mutationFn: async (params: GetPoolActivitiesParams = {}) => {
            const {
                poolId,
                user,
                type = "ALL",
                limit = 10,
                skip = 0,
                orderDirection = "desc"
            } = params;

            // Xây dựng các điều kiện filter
            const filters = [];
            if (poolId) filters.push(`pool: "${poolId}"`);
            if (user) filters.push(`user: "${user}"`);
            if (type !== "ALL") filters.push(`type: "${type}"`);

            // Tạo chuỗi filter
            const whereClause = filters.length > 0 ? `where: { ${filters.join(", ")} }` : "";

            const url = process.env.NEXT_PUBLIC_THE_GRAPH || "";
            const query = gql`{
        recentActivities(
          ${whereClause}
          first: ${limit}
          skip: ${skip}
          orderBy: timestamp
          orderDirection: ${orderDirection}
        ) {
          id
          pool {
            id
            name
            symbol
          }
          user
          amount
          timestamp
          transactionHash
          type
        }
      }`;

            const res: any = await request({
                url: url,
                document: query,
                requestHeaders: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                },
            });

            return res.recentActivities ? res.recentActivities : [];
        }
    });
};

export default useGetPoolActivities; 