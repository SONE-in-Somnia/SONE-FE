import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
  const userName = "Somnia_Network";

  if (!twitterBearerToken) {
    return res.status(500).json({ error: "Twitter Bearer Token not found" });
  }

  try {
    // Step 1: Get the User ID from the username.
    // Next.js will automatically cache the result of this fetch call.
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
        next: {
          revalidate: 900, // Cache this result for 15 minutes (900 seconds)
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

    // Step 2: Get tweets using the User ID.
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets`,
      {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
        next: {
          revalidate: 900, // Cache this result for 15 minutes
        },
      }
    );

    if (!tweetsResponse.ok) {
      const errorBody = await tweetsResponse.text();
      console.error("Twitter Tweets API Error:", tweetsResponse.status, tweetsResponse.statusText, errorBody);
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status} ${errorBody}`);
    }

    const tweetsData = await tweetsResponse.json();
    res.status(200).json(tweetsData);

  } catch (error) {
    console.error("Error in Twitter API handler:", error);
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
};

export default handler;


