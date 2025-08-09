import React from "react";
import Image from "next/image";

const Sidebar = () => {
  const navItems = [
    { name: "DISCOVER", icon: "/globe.svg" },
    { name: "REWARDS", icon: "/star.svg" },
    { name: "LEADERBOARD", icon: "/images/champion.png" },
    { name: "MY WALLET", icon: "/file.svg" },
  ];

  return (
    <div className="bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white p-4 h-full flex flex-col">
      <div className="mb-8">
        <Image src="/logo.svg" alt="SONE Logo" width={150} height={50} />
      </div>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <button key={item.name} className="bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white p-2 text-left flex items-center space-x-4 hover:bg-gray-400 active:border-l-black active:border-t-black active:border-r-white active:border-b-white">
            <Image src={item.icon} alt={item.name} width={24} height={24} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
