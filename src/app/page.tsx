import MatrixRain from "@/components/MatrixRain";
import React from "react";
import TopBanner from "../views/home-v2/components/TopBanner";
import SpotlightGames from "../views/home-v2/components/SpotlightGames";
import NftPreview from "../views/home-v2/components/NftPreview";
import SonesHub from "../views/home-v2/components/SonesHub";
import SomniaBlog from "../views/home-v2/components/SomniaBlog";
import TestnetFaucet from "../views/home-v2/components/TestnetFaucet";

const HomeV2Page = () => {
  return (
    <>
      <MatrixRain />
      <div className="grid grid-cols-12 grid-rows-12 h-[1024px] overflow-hidden gap-3">

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

        {/* SONE's HUB */}
        <div className="col-span-8 row-span-4">
          <SonesHub />
        </div>

        {/* Blog and Faucet */}
        <div className="col-span-4 row-span-4 grid grid-rows-3 gap-4">
          <div className="row-span-3">
              <SomniaBlog />
          </div>
          <div className="row-span-1">
              <TestnetFaucet />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeV2Page;