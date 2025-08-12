'use client'

import React, { useState, useEffect } from "react";
import Window from "./Window";
import Image from "next/image";
import { RetroButton } from "@/components/RetroButton";

interface Tweet {
  id: string;
  text: string;
}

const SomniaBlog = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchTweets();
  }, []);

  useEffect(() => {
    if (tweets.length > 1) {
      const interval = setInterval(() => {
        setCurrentTweetIndex((prevIndex) => (prevIndex + 1) % tweets.length);
      }, 30000); // Change tweet every 30 seconds

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [tweets]);

  const currentTweet = tweets[currentTweetIndex];
  const tweetUrl = currentTweet ? `https://twitter.com/Somnia_Network/status/${currentTweet.id}` : "#";

  return (
    <Window title="📰 SOMNIA BLOG 📰">
      <div className="flex space-x-1 h-full relative">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <p>Loading tweets...</p>
          </div>
        ) : currentTweet ? (
          <>
            <div className="w-1/3">
              <Image
                src="/images/somniaBlog.png"
                alt="Blog Post"
                width={100}
                height={100}
              />
            </div>
            <div className="w-2/3">
              <h3 className="font-bold pr-10">Somnia @Somnia_Network</h3>
              <p className="text-sm pr-10">{currentTweet.text}</p>
            </div>
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="absolute top-0 right-0">
              <RetroButton className="w-8 h-8 p-2">
                <Image
                  src="/images/Vector.png"
                  alt="Go"
                  width={48}
                  height={48}
                  className="w-full h-full"
                />
              </RetroButton>
            </a>
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
