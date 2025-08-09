import { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory cache
let cache = {
  data: null as any,
  lastFetched: 0,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const now = Date.now();

  // If cache is still valid, return cached data
  if (cache.data && now - cache.lastFetched < CACHE_DURATION) {
    return res.status(200).json(cache.data);
  }

  const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
  const userName = "Somnia_Network";

  if (!twitterBearerToken) {
    return res.status(500).json({ error: "Twitter Bearer Token not found" });
  }

  try {
    // Step 1: Get the User ID from the username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user ID: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Get tweets using the User ID
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets`,
      {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      const errorBody = await tweetsResponse.text();
      console.error("Twitter Tweets API Error:", tweetsResponse.status, tweetsResponse.statusText, errorBody);
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status} ${errorBody}`);
    }

    const tweetsData = await tweetsResponse.json();

    // Update cache
    cache = {
      data: tweetsData,
      lastFetched: now,
    };

    res.status(200).json(tweetsData);

  } catch (error) {
    console.error("Error in Twitter API handler:", error);
    // Return the cached data if available, even if the fetch fails, to improve resilience
    if (cache.data) {
      return res.status(200).json(cache.data);
    }
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
};

export default handler;


