import React from "react";
import Window from "./Window";
import Image from "next/image";

const NftPreview = () => {
  return (
    <Window title="🖼️ SONE'S NFT PREVIEW 🖼️">
      <div className="bg-black p-2 h-full relative">
        <Image
          src="/images/imageNFT.png"
          alt="NFT Preview"
          width={400}
          height={300}
          className="w-full h-full"
        />
        <div
          className="absolute inset blur-sm "
          
        ></div>
      </div>
    </Window>
  );
};

export default NftPreview;

