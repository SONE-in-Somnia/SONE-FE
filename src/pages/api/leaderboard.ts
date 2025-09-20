import type { NextApiRequest, NextApiResponse } from "next";

type Player = {
  name: string;
  score: number;
};

const players = [
  "0x12...abcd",
  "0x56...efgh",
  "0x9a...ijkl",
  "0xcd...mnop",
  "0xef...qrst",
  "0xuv...wxyz",
];

// Function to generate leaderboard data with random scores
const generateLeaderboard = (): Player[] => {
  const leaderboard: Player[] = players.map(name => ({
    name,
    score: parseFloat((Math.random() * 2 + 0.1).toFixed(3)), // Generates a score between 0.1 and 2.1
  }));

  // Sort by score in descending order
  return leaderboard.sort((a, b) => b.score - a.score).slice(0, 4);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player[]>
) {
  if (req.method === "GET") {
    const leaderboard = generateLeaderboard();
    res.status(200).json(leaderboard);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
