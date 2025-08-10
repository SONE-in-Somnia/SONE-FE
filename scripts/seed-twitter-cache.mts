// scripts/seed-twitter-cache.mts
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const USERNAME = "Somnia_Network";
const CACHE_FILE_PATH = path.join(process.cwd(), 'public', 'twitter-cache.json');

interface Tweet {
  id: string;
  text: string;
}

async function seedTwitterCache() {
  console.log("--- Twitter Cache Seeding Script ---");

  if (!TWITTER_BEARER_TOKEN) {
    console.error("ERROR: TWITTER_BEARER_TOKEN is not defined. Please create a .env.local file and add it.");
    process.exit(1);
  }

  try {
    // 1. Get User ID from Username
    console.log(`Fetching user ID for "${USERNAME}"...`);
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${USERNAME}`,
      { headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` } }
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    if (!userData.data) {
      throw new Error(`User "${USERNAME}" not found.`);
    }
    const userId = userData.data.id;
    console.log(`User ID found: ${userId}`);

    // 2. Get Latest Tweet from User ID
    console.log("Fetching latest tweet...");
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=5`,
      { headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` } }
    );

    if (!tweetsResponse.ok) {
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status} ${tweetsResponse.statusText}`);
    }

    const tweetsData = await tweetsResponse.json();
    const latestTweet = tweetsData.data && tweetsData.data.length > 0 ? tweetsData.data[0] : null;

    if (!latestTweet) {
      console.warn("Warning: No tweets found for this user. The cache will be created with an empty array.");
    }

    // 3. Transform and Save to Cache File
    const transformedTweets: Tweet[] = latestTweet ? [{ id: latestTweet.id, text: latestTweet.text }] : [];
    
    const cacheContent = {
      tweets: transformedTweets,
    };

    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheContent, null, 2), 'utf-8');
    console.log(`✅ Success! Twitter cache seeded at: ${CACHE_FILE_PATH}`);

  } catch (error) {
    console.error("❌ Error seeding Twitter cache:", error);
    process.exit(1);
  }
}

seedTwitterCache();