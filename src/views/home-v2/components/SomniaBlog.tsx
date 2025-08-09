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
        const response = await fetch("/api/twitter");
        const data = await response.json();
        if (data.data) {
          setTweets(data.data);
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
    if (tweets.length > 0) {
      const interval = setInterval(() => {
        setCurrentTweetIndex((prevIndex) =>
          (prevIndex + 1) % tweets.length
        );
      }, 5000); // Change tweet every 5 seconds

      return () => clearInterval(interval);
    }
  }, [tweets]);

  const currentTweet = tweets[currentTweetIndex];

  return (
    <Window title="📰 SOMNIA BLOG 📰">
      <div className="flex space-x-4 h-full relative">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <p>Loading tweets...</p>
          </div>
        ) : currentTweet ? (
          <>
            <div className="w-1/3">
              <Image
                src="/images/banner_8.png"
                alt="Blog Post"
                width={100}
                height={100}
              />
            </div>
            <div className="w-2/3">
              <h3 className="font-bold">Somnia @Somnia_Network</h3>
              <p className="text-sm">{currentTweet.text}</p>
            </div>
            <RetroButton className="absolute top-0 right-0 w-8 h-8 p-2">
              <Image
                src="/images/Vector.png"
                alt="Go"
                width={48}
                height={48}
                className="w-full h-full"
              />
            </RetroButton>
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
