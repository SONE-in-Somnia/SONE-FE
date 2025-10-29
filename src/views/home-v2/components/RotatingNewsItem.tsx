import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";

interface Tweet {
  id: string;
  text: string;
}

interface RotatingNewsItemProps {
  allTweets: Tweet[];
  initialIndex?: number; // Optional: to start rotation from a different point
}

const RotatingNewsItem: React.FC<RotatingNewsItemProps> = ({
  allTweets,
  initialIndex = 0,
}) => {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(initialIndex);

  useEffect(() => {
    if (allTweets.length > 1) {
      const interval = setInterval(() => {
        setCurrentTweetIndex((prevIndex) => (prevIndex + 1) % allTweets.length);
      }, 30000); // Change tweet every 30 seconds

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [allTweets]);

  const currentTweet = allTweets[currentTweetIndex];

  if (!currentTweet) {
    return null; // Or a placeholder if no tweet is available
  }

  return <NewsItem tweet={currentTweet} />;
};

export default RotatingNewsItem;
