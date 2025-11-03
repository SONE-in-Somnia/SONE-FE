"use client"

import React, { useState, useEffect } from "react";
import Window from "./Window";
import Image from "next/image";

const images = [
  { src: "/images/nfts/nft1.jpeg", alt: "NFT Collection #1" },
  { src: "/images/nfts/nft2.jpeg", alt: "NFT Collection #2" },
  { src: "/images/nfts/nft3.jpeg", alt: "NFT Collection #3" },
  { src: "/images/nfts/nft4.jpeg", alt: "NFT Collection #4" },
  { src: "/images/nfts/nft5.jpeg", alt: "NFT Collection #5" },
  { src: "/images/nfts/nft6.png", alt: "NFT Collection #6" },
];

const NftPreview = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
        setImageError(false); // Reset error state on image change
      }, 1000);
    }, 2000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  return (
    <Window title="🖼️ SONE'S NFT PREVIEW 🖼️">
      <div className="bg-black p-2 h-full relative">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>Failed to load NFT image</p>
          </div>
        ) : (
          images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className={`w-full h-full absolute top-2 left-0 transition-opacity duration-500 ease-in-out object-cover ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                } ${isAnimating && index === currentImageIndex ? "animate-glitch" : ""}`}
              onError={() => setImageError(true)}
              priority={index === 0}
            />
          ))
        )}
      </div>
    </Window>
  );
};

export default NftPreview;
