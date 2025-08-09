import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

// --- Configuration ---
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const DEFAULT_USERNAME = "Somnia_Network";
const CACHE_DURATION = parseInt(process.env.TWITTER_CACHE_DURATION || '3600000', 10); // 1 hour
const RETRIES = parseInt(process.env.TWITTER_API_RETRIES || '3', 10);
const BACKOFF = parseInt(process.env.TWITTER_API_BACKOFF || '1000', 10);

// --- Type Definitions ---
interface Tweet {
  id: string;
  text: string;
}

interface CachedData {
  tweets: Tweet[];
  timestamp: number;
}

interface ApiResponse extends CachedData {
  source: 'cache' | 'api';
}

// --- File-based Cache ---
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache');
const getCacheFilePath = (username: string) => path.join(CACHE_DIR, `twitter-cache-${username}.json`);

// --- Helper Functions ---
const fetchWithRetry = async (url: string, options: RequestInit, retries: number, initialBackoff: number) => {
  let backoff = initialBackoff;
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
      console.log(`Attempt ${i + 1} failed with status ${response.status}. Retrying in ${backoff}ms...`);
      await new Promise(res => setTimeout(res, backoff));
      backoff *= 2;
    } else {
      return response;
    }
  }
  throw new Error(`Failed to fetch from Twitter API after ${retries} attempts`);
};

const getSanitizedError = (status: number): { statusCode: number, message: string } => {
  switch (status) {
    case 401:
      return { statusCode: 401, message: "Authentication failed. Please check the API token." };
    case 404:
      return { statusCode: 404, message: "Twitter user not found." };
    case 429:
      return { statusCode: 429, message: "Rate limit exceeded. Please try again later." };
    default:
      return { statusCode: status, message: "Failed to fetch data from Twitter." };
  }
};

// --- API Handler ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!TWITTER_BEARER_TOKEN) {
    return res.status(500).json({ error: "Twitter Bearer Token not configured on the server." });
  }

  const usernameQuery = req.query.username;
  const username = (typeof usernameQuery === 'string' && /^[a-zA-Z0-9_]{1,15}$/.test(usernameQuery))
    ? usernameQuery
    : DEFAULT_USERNAME;

  const cacheFilePath = getCacheFilePath(username);

  // Check file-based cache
  try {
    const cachedFile = await fs.readFile(cacheFilePath, 'utf-8');
    const cachedData: CachedData = JSON.parse(cachedFile);
    const now = Date.now();

    if (now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Serving tweets for "${username}" from file cache.`);
      return res.status(200).json({ ...cachedData, source: 'cache' });
    }
  } catch (error) {
    // Ignore error if cache file doesn't exist or is invalid
    console.log(`No valid cache found for "${username}".`);
  }

  console.log(`Fetching fresh tweets for "${username}" from Twitter API.`);

  try {
    const headers = { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` };

    const userResponse = await fetchWithRetry(
      `https://api.twitter.com/2/users/by/username/${username}`,
      { headers },
      RETRIES,
      BACKOFF
    );

    if (!userResponse.ok) {
      const { statusCode, message } = getSanitizedError(userResponse.status);
      return res.status(statusCode).json({ error: message });
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    const tweetsResponse = await fetchWithRetry(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=1`,
      { headers },
      RETRIES,
      BACKOFF
    );

    if (!tweetsResponse.ok) {
      const { statusCode, message } = getSanitizedError(tweetsResponse.status);
      return res.status(statusCode).json({ error: message });
    }

    const tweetsData = await tweetsResponse.json();

    const transformedTweets = tweetsData.data ? tweetsData.data.map((tweet: Tweet) => ({
      id: tweet.id,
      text: tweet.text,
    })) : [];

    const newCacheEntry: CachedData = {
      tweets: transformedTweets,
      timestamp: Date.now(),
    };

    // Write to file cache
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cacheFilePath, JSON.stringify(newCacheEntry), 'utf-8');

    res.status(200).json({ ...newCacheEntry, source: 'api' });
  } catch (error) {
    console.error(`Unhandled error in Twitter API handler for "${username}":`, error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
