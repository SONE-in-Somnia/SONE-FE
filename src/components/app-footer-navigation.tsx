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
import { LogOut, Globe, Ticket, Sparkles, Trophy, LoaderPinwheel, Wallet, Copy } from "lucide-react";
import { convertWeiToEther, formatEthereumAddress } from "@/utils/string";
import { networks } from "@/config";
import { toast } from "react-toastify";
import { RetroButton } from "./RetroButton";
import Window from "@/views/home-v2/components/Window";

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
  const [showWalletPopup, setShowWalletPopup] = React.useState(false);

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
    <>
      {/* Floating Wallet Icon - only when connected */}
      {isConnected && (
        <div className="fixed left-0 top-3/4 -translate-y-1/2 z-50">
          <button
            onClick={() => setShowWalletPopup(!showWalletPopup)}
            className="bg-retro-gray border-4 border-r-black border-b-black border-l-white border-t-white p-3 rounded-r-lg hover:bg-retro-gray-2 transition-all shadow-lg"
          >
            <Wallet size={24} />
          </button>

          {/* Popup Window */}
          {showWalletPopup && (
            <>
              {/* Overlay to close popup */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowWalletPopup(false)}
              />

              {/* Wallet Popup */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50">
                <Window
                  title={
                    <div className="flex items-center gap-2">
                      <span>{formatEthereumAddress(address)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!address) return;
                          try {
                            navigator.clipboard.writeText(address);
                            toast.success("Copied to clipboard!");
                          } catch (err) {
                            toast.error("Failed to copy address");
                          }
                        }}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  }
                  className="!h-auto !w-[280px]"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-gray-600 font-pixel-operator">Balance</span>
                      <span className="text-2xl font-bold font-pixel-operator">
                        {supportedTokens.length > 0
                          ? convertWeiToEther(supportedTokens[0].balance || 0)
                          : "0"}{" "}
                        {networks[0].nativeCurrency.symbol}
                      </span>
                    </div>
                    <RetroButton
                      className="w-full h-9 font-pixel-operator bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                      onClick={() => {
                        disconnect();
                        setShowWalletPopup(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>DISCONNECT</span>
                    </RetroButton>
                  </div>
                </Window>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex justify-between items-center w-full gap-4">
        {/* Left section with navigation */}
        <div className="flex space-x-4">
          {!isConnected && (
            <RetroButton
              className="h-9 whitespace-nowrap font-pixel-operator flex items-center space-x-2"
              onClick={() => open()}
            >
              <Wallet size={16} />
              <span>CONNECT WALLET</span>
            </RetroButton>
          )}
          {navItems.map((item) => {
            const Icon = {
              globe: Globe,
              ticket: Ticket,
              sparkles: Sparkles,
              trophy: Trophy,
              "loader-pinwheel": LoaderPinwheel,
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

        {/* Right section with social icons and time */}
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
    </>
  );
}
