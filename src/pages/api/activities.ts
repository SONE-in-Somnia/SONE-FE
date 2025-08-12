import type { NextApiRequest, NextApiResponse } from "next";

type Activity = string;

const sampleActivities: Activity[] = [
  "0x9k...l45 just win 0.123 STT in wheely game",
  "0x8m...n67 just dep 0.7 STT in wheely game",
  "0x7o...p89 just win 3.5 STT in wheely",
  "0x6q...r01 just dep 0.3 STT in wheely game",
  "0x5s...t23 just win 1.1 STT in wheely game",
  "0x4u...v45 just dep 0.9 STT in wheely",
  "0x3w...x67 just win 0.05 STT in wheely game",
  "0x2y...z89 just dep 1.5 STT in wheely game",
  "0x1a...b45 just dep 0.5 STT in wheely game",
  "0x2c...d67 just win 1.2 STT in wheely",
  "0x3e...f89 just dep 0.1 STT in wheely game",
  "0x4g...h01 just win 0.8 STT in wheely game",
];

// Function to get a random subset of activities
const getRandomActivities = (count: number): Activity[] => {
  const shuffled = sampleActivities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Activity[]>
) {
  if (req.method === "GET") {
    const activities = getRandomActivities(6);
    res.status(200).json(activities);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
