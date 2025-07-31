import { useMutation } from "@tanstack/react-query"
import request, { gql } from "graphql-request"

const useGetCurrentBlock = () => {
  return useMutation({
    mutationKey: ["GET_CURRENT_BLOCK"],
    mutationFn: async () => {
      const url = process.env.NEXT_PUBLIC_THE_GRAPH || ""
      const query = gql`{
  _meta {
    block {
      number
      hash
    }
  }
}

`

      const res: any = await request({
        url: url,
        document: query,
        requestHeaders: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      })
      return res._meta ? res._meta : { block: { number: 0, hash: '' } }
    }
  })
}

export default useGetCurrentBlock;