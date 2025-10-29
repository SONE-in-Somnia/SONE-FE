'use client'

import React, { useState, useEffect } from "react";
import Window from "./Window";
import RotatingNewsItem from "./RotatingNewsItem"; // Import the new component

interface Tweet {
  id: string;
  text: string;
}

const SomniaBlog = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    try {
      // Using the local cache directly for simplicity
      const response = await fetch('/twitter-cache.json');
      const data = await response.json();
      if (data && data.tweets && data.tweets.length > 0) {
        setTweets(data.tweets);
      }
    } catch (error) {
      console.error("Failed to fetch tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Window title="📰 SOMNIA NEWS 📰">
      <div className="flex flex-col space-y-4 h-full relative">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <p>Loading tweets...</p>
          </div>
        ) : tweets.length > 0 ? (
          <>
            <RotatingNewsItem allTweets={tweets} initialIndex={0} />
            <RotatingNewsItem allTweets={tweets} initialIndex={1} />
            <RotatingNewsItem allTweets={tweets} initialIndex={2} />
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p>No tweets found.</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default SomniaBlog;
