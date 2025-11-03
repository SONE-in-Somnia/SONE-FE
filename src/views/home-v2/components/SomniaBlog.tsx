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
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = async () => {
    try {
      setError(null);
      const response = await fetch('/twitter-cache.json');

      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }

      const data = await response.json();
      if (data && data.tweets && data.tweets.length > 0) {
        setTweets(data.tweets);
      } else {
        setError('No tweets available');
      }
    } catch (error) {
      console.error("Failed to fetch tweets:", error);
      setError(error instanceof Error ? error.message : 'Failed to load tweets');
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
          <div className="w-full flex items-center justify-center h-full">
            <p className="font-pixel-operator">Loading tweets...</p>
          </div>
        ) : error ? (
          <div className="w-full flex flex-col items-center justify-center h-full gap-2">
            <p className="text-red-500 font-pixel-operator">{error}</p>
            <button
              onClick={fetchTweets}
              className="text-sm underline hover:text-blue-500"
            >
              Retry
            </button>
          </div>
        ) : tweets.length > 0 ? (
          <>
            <RotatingNewsItem allTweets={tweets} initialIndex={0} />
            <RotatingNewsItem allTweets={tweets} initialIndex={1} />
            <RotatingNewsItem allTweets={tweets} initialIndex={2} />
          </>
        ) : (
          <div className="w-full flex items-center justify-center h-full">
            <p className="font-pixel-operator">No tweets found.</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default SomniaBlog;
