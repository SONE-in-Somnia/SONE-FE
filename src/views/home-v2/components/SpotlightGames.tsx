"use client";

import React, { useRef, useState, useEffect } from "react";
import Window from "./Window";
import Image from "next/image";
import { RetroButton } from "@/components/RetroButton";
import styles from "../../../styles/SpotlightGames.module.css";
import { useRouter } from "next/navigation";

const SpotlightGames = () => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // Measure track width for accurate pixel-based positioning
  useEffect(() => {
    const updateTrackWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth);
      }
    };
    
    updateTrackWidth();
    window.addEventListener('resize', updateTrackWidth);
    return () => window.removeEventListener('resize', updateTrackWidth);
  }, []);

  const games = [
    { name: "Wheely Wheely", image: "/images/wheel1.jpeg", link: "/wheely-wheely" },
    { name: "Raffle on Sone", image: "/images/raffle.png", link: "/raffle" },
    { name: "Jackpot", image: "/images/wheel3.jpeg", link: "#" }, // Added a third game for visual
    { name: "Coin Flip", image: "/images/raffle.png", link: "#" }, // Added a fourth game for visual
  ];

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  const updateScrollProgress = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Each game card takes up 50% of viewport width (w-1/2)
      const cardWidth = clientWidth / 2;
      // Calculate based on number of games that can be scrolled
      const scrollableGames = games.length - 2; // -2 because we always see 2 games
      const maxScroll = scrollableGames * cardWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(Math.min(1, progress)); // Clamp to max 1
    }
  };

  const handleThumbDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const trackElement = e.currentTarget.parentElement;
    if (!trackElement || !scrollContainerRef.current) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const trackRect = trackElement.getBoundingClientRect();
      const relativeX = moveEvent.clientX - trackRect.left;
      const progress = Math.max(0, Math.min(1, relativeX / trackRect.width));

      if (scrollContainerRef.current) {
        const { clientWidth } = scrollContainerRef.current;
        const cardWidth = clientWidth / 2;
        const scrollableGames = games.length - 2;
        const maxScroll = scrollableGames * cardWidth;
        scrollContainerRef.current.scrollLeft = progress * maxScroll;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse wheel for horizontal scrolling
  const handleWheel = (e: WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!scrollContainerRef.current) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        scrollContainerRef.current.scrollLeft -= 200;
        break;
      case 'ArrowRight':
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += 200;
        break;
      case 'Home':
        e.preventDefault();
        scrollContainerRef.current.scrollLeft = 0;
        break;
      case 'End':
        e.preventDefault();
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        break;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollProgress();
      container.addEventListener("scroll", updateScrollProgress);
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("keydown", handleKeyDown);

      return () => {
        container.removeEventListener("scroll", updateScrollProgress);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <Window title="🎮 SPOTLIGHT GAMES ⚔">
      <div className="h-full flex flex-col justify-center">
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden space-x-4 focus:outline-none"
          tabIndex={0}
        >
          {games.map((game, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-1/2 bg-retro-gray-2 ring-4 ring-retro-gray-1 h-[300px] flex flex-col"
            >
              <div className="h-3/4">
                <Image
                  src={game.image}
                  alt={game.name}
                  width={319}
                  height={203}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/4 flex items-center justify-between p-2">
                <div className="flex items-center justify-between gap-2">
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{game.name}</span>
                </div>
                <RetroButton onClick={() => router.push(game.link)}>Play</RetroButton>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[url(/images/trans-bg.jpg)] bg-repeat bg-[length:350px_350px] flex items-center justify-between gap-3 mt-5">
          <RetroButton className="" onClick={() => scroll(-200)}>
            {"<"}
          </RetroButton>

          {/* Custom Scrollbar Track */}
          <div ref={trackRef} className="flex-1 relative h-10 cursor-pointer">
            {/* Scrollbar Thumb */}
            <div
              style={{
                width: `${Math.max(10, 100 / games.length)}%`,
                transform: (() => {
                  if (trackWidth === 0) return 'translateX(0)';
                  
                  const thumbWidthPercent = Math.max(10, 100 / games.length);
                  const thumbWidthPx = (thumbWidthPercent / 100) * trackWidth;
                  const maxTranslatePx = trackWidth - thumbWidthPx;
                  const translateXPx = scrollProgress * maxTranslatePx;
                  
                  return `translateX(${translateXPx}px)`;
                })(),
              }}
              className={`absolute h-full bg-retro-gray border-4 border-r-black border-b-black border-t-white transition-opacity ${isDragging ? "opacity-100" : "opacity-90 hover:opacity-100"
                }`}
              onMouseDown={handleThumbDrag}
            />
          </div>

          <RetroButton className="" onClick={() => scroll(200)}>
            {">"}
          </RetroButton>
        </div>
      </div>
    </Window>
  );
};

export default SpotlightGames;