import React from "react";
import Image from "next/image";
import { RetroButton } from "@/components/RetroButton";

interface Tweet {
  id: string;
  text: string;
}

interface NewsItemProps {
  tweet: Tweet;
}

const NewsItem: React.FC<NewsItemProps> = ({ tweet }) => {
  const tweetUrl = `https://twitter.com/Somnia_Network/status/${tweet.id}`;

  return (
    <div className="flex space-x-1 relative w-full"> {/* Added relative and w-full */}
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
        <p className="text-sm pr-10">{tweet.text}</p>
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
    </div>
  );
};

export default NewsItem;
