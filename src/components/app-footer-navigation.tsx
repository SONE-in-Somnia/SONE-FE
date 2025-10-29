"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Globe, Ticket, Sparkles, Trophy, LoaderPinwheel } from "lucide-react";
import { convertWeiToEther, formatEthereumAddress } from "@/utils/string";
import { networks } from "@/config";
import { toast } from "react-toastify";
import { RetroButton } from "./RetroButton";

// This is sample data.
const data = {
  navMain: [
    {
      title: "DISCOVER",
      url: "/",
      iconName: "globe",
      isActive: true,
      group: "main",
    },
    {
      title: "WHEELY",
      url: "/wheely-wheely",
      iconName: "loader-pinwheel",
      group: "games",
    },
    {
      title: "RAFFLE",
      url: "/raffle",
      iconName: "ticket",
      group: "games",
    },
    {
      title: "REWARDS",
      url: "/rewards",
      iconName: "sparkles",
      group: "main",
    },
    {
      title: "LEADERBOARD",
      url: "/leaderboard",
      iconName: "trophy",
      group: "main",
    },
  ],
};

export function AppFooterNavigation() {
  const pathname = usePathname();
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
  const { user, signMessageWithSign, isSyncMessage, supportedTokens } = useAuth();
  const { disconnect } = useDisconnect();

  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };

    updateTime(); // Set initial time
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once on mount

  const navItems = React.useMemo(() => {
    return data.navMain.map((item) => ({
      ...item,
      isActive: pathname === item.url,
    }));
  }, [pathname]);

  return (
    <div className="flex justify-between items-center w-full">
      {/* Left section with buttons */}
      <div className="flex space-x-4">
        {!isConnected ? (
          <RetroButton
            className="h-9 whitespace-nowrap font-pixel-operator"
            onClick={() => open()}
          >
            CONNECT WALLET
          </RetroButton>
        ) : (
          <RetroButton
            className="h-9 whitespace-nowrap font-pixel-operator bg-red-600 hover:bg-red-700"
            onClick={() => disconnect()}
          >
            DISCONNECT
          </RetroButton>
        )}
        {navItems.map((item) => {
          const Icon = {
            globe: Globe,
            ticket: Ticket,
            sparkles: Sparkles,
            trophy: Trophy,
            "loader-pinwheel": LoaderPinwheel,
            // Add other icons as needed
          }[item.iconName as string];

          return (
            <Link href={item.url} key={item.title}>
              <RetroButton
                className={`h-9 whitespace-nowrap font-pixel-operator ${item.isActive ? "bg-[#D4D5D4] border-4 border-l-gray-500 border-t-gray-500 border-b-0 border-r-0" : ""} flex items-center space-x-2`}
              >
                {Icon && <Icon size={16} />}
                <span>{item.title}</span>
              </RetroButton>
            </Link>
          );
        })}
      </div>

      {/* Right section with icons and time */}
      <div className="flex items-center space-x-4 border-4 border-l-retro-black/50 border-t-retro-black/50 border-b-retro-gray-5 border-r-retro-gray-5 px-4 py-2">
        {/* Placeholder for SONE logo */}
        <div className="">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/images/logo.svg"
              width={20}
              height={20}
              alt="logo"
              priority
              className="rounded-md"
            />
            <h1 className="font-modern-warfare text-gradient w-fit text-sm">
              SONE
            </h1>
          </Link>
        </div>
        <p>|</p>
        {/* Placeholder for Discord icon */}
        <a href="">
          <Image src="/images/discord-logo-3d.svg" alt="Discord" width={24} height={24} />
        </a>
        
        {/* Placeholder for X (Twitter) icon */}
        <a href="">
          <Image src="/images/x-logo-3d.svg" alt="X" width={24} height={24} />
        </a>
        <p>|</p>
        <span className="font-pixel-operator">⏰ {currentTime}</span>
      </div>
    </div>
  );
}
