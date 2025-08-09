"use client"

import React, { useState, useEffect } from "react";
import Window from "./Window";
import Image from "next/image";

const images = [
  "/images/nfts/nft1.jpeg",
  "/images/nfts/nft2.jpeg",
  "/images/nfts/nft3.jpeg",
  "/images/nfts/nft4.jpeg",
  "/images/nfts/nft5.jpeg",
  "/images/nfts/nft6.png",
];

const NftPreview = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setIsAnimating(true);
      // The animation duration is 1s. After it finishes, update the image index.
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 1000);
    }, 1500); // Total cycle time: 1s for animation + 0.5s pause

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  return (
    <Window title="🖼️ SONE'S NFT PREVIEW 🖼️">
      <div className="bg-black p-2 h-full relative">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="NFT Preview"
            width={400}
            height={300}
            className={`w-full h-full absolute top-2 left-0 transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            } ${isAnimating && index === currentImageIndex ? "animate-glitch" : ""}`}
          />
        ))}
        <div className="absolute inset-0 blur-sm"></div>
      </div>
    </Window>
  );
};

export default NftPreview;
