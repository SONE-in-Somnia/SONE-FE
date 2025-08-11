import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

// The path to the pre-filled cache file in the public directory
const CACHE_FILE_PATH = path.join(process.cwd(), 'public', 'twitter-cache.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Read the content of the pre-seeded cache file
    const fileContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    const cachedData = JSON.parse(fileContent);

    // Instruct the browser not to cache this API route's response
    res.setHeader('Cache-Control', 'no-cache');

    // Return the content of the file
    res.status(200).json(cachedData);
    
  } catch (error) {
    console.error("Error reading Twitter cache file:", error);
    // If the file doesn't exist or there's an error, return an empty state
    return res.status(500).json({ error: "Twitter cache is not available. Please run the seeding script." });
  }
}