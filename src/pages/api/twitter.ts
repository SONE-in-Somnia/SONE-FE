import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN; // Add your Twitter Bearer Token to your .env.local file
  console.log("Twitter Bearer Token:", twitterBearerToken); // Temporary debug line

  if (!twitterBearerToken) {
    return res.status(500).json({ error: "Twitter Bearer Token not found" });
  }

  try {
    const response = await fetch(
      "https://api.twitter.com/2/users/by/username/Somnia_Network/tweets",
      {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Twitter API Error:", response.status, response.statusText, errorBody);
      throw new Error(`Failed to fetch tweets: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
};

export default handler;
