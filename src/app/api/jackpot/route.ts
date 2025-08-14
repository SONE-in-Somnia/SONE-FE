
import { NextResponse } from "next/server";
import { JackpotRound, RoundHistoryResponse } from "@/types/round";

// This is a placeholder implementation.
// Replace this with your actual logic to fetch jackpot history.

const dummyJackpotData: JackpotRound[] = [
  {
    jackPotId: "jp_1",
    roundId: 101,
    winner: "0x1234567890123456789012345678901234567890",
    totalPool: BigInt("100000000000000000000"), // 100 tokens
    txTransferred: "0xtxhash1",
    status: "Ended",
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    jackPotId: "jp_2",
    roundId: 102,
    winner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    totalPool: BigInt("250000000000000000000"), // 250 tokens
    txTransferred: "0xtxhash2",
    status: "Ended",
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page = 1, limit = 10, address } = body;

    console.log("Received request for jackpot history:", { page, limit, address });

    // In a real implementation, you would use these parameters
    // to fetch data from a database or another service.
    // If an 'address' is provided, you would filter by that address.

    // Convert BigInt to string for JSON serialization
    const serializableData = dummyJackpotData.map(item => ({
      ...item,
      totalPool: item.totalPool.toString(),
    }));

    const response = {
      success: true,
      message: "Jackpot history fetched successfully.",
      data: serializableData,
      page: page,
      size: limit,
      total: serializableData.length,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in /api/jackpot:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}
