import MatrixRain from "@/components/MatrixRain";
import React from "react";
import TopBanner from "../views/home-v2/components/TopBanner";
import SpotlightGames from "../views/home-v2/components/SpotlightGames";
import NftPreview from "../views/home-v2/components/NftPreview";
import SomniaBlog from "../views/home-v2/components/SomniaBlog";
import FloatingEmojis from "../components/FloatingEmojis";
import Activities from "../views/home-v2/components/Activities";
import Leaderboard from "../views/home-v2/components/Leaderboard";


const HomeV2Page = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MatrixRain />
      <FloatingEmojis />
      <div className="flex-grow grid grid-cols-12 grid-rows-12 h-[1024px] overflow-hidden gap-3">

        {/* Top Banner */}
        <div className="col-span-12 row-span-2">
          <TopBanner />
        </div>

        {/* Spotlight Games */}
        <div className="col-span-8 row-span-6">
          <SpotlightGames />
        </div>

        {/* NFT Preview */}
        <div className="col-span-4 row-span-6">
          <NftPreview />
        </div>

        {/* Activities */}
        <div className="col-span-4 row-span-4">
          <Activities />
        </div>

        {/* Somnia News */}
        <div className="col-span-4 row-span-4">
          <SomniaBlog />
        </div>

        {/* Leaderboard */}
        <div className="col-span-4 row-span-4">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default HomeV2Page;
