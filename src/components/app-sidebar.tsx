"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { Divider } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
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
      title: "RAFFLE",
      url: "/raffle",
      iconName: "ticket",
      group: "main",
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
      group: "games",
    },
    {
      title: "MY PROFILE",
      url: "/myprofile",
      iconName: "rocket",
      group: "social",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isConnected, address } = useAppKitAccount();
  const { setOpenMobile, openMobile, isMobile } = useSidebar();
  const { open, close } = useAppKit();
  const { user, signMessageWithSign, isSyncMessage, supportedTokens } = useAuth();
  const { disconnect } = useDisconnect();

  // Cập nhật trạng thái active dựa trên pathname hiện tại
  const navItems = React.useMemo(() => {
    return data.navMain.map((item) => ({
      ...item,
      isActive: pathname === item.url,
    }));
  }, [pathname]);

  return (
    <>
      <div
        onClick={() => setOpenMobile(false)}
        className={`fixed left-0 top-0 z-[99] h-screen w-screen bg-black/30 transition-all ${(!openMobile || !isMobile) && "hidden"}`}
      />
      <div
        className={`fixed left-0 top-0 h-screen p-2 max-lg:z-[100] ${openMobile ? "max-lg:translate-x-0" : "max-lg:translate-x-[-100%]"} transition-all`}
      >
        <Sidebar
          collapsible="none"
          className={`h-full bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white max-lg:bg-background`}
          {...props}
        >
          <SidebarHeader className="">
            <div className="flex items-center justify-between px-1 py-2">
              <div className="">
                <Link href="/" className="flex items-center gap-1">
                    <Image
                      src="/images/logo.svg"
                      width={42}
                      height={42}
                      alt="logo"
                      priority
                      className="rounded-md"
                    />
                  <h1 className="font-modern-warfare text-gradient w-fit text-4xl">
                    SONE
                  </h1>
                </Link>
              </div>
            </div>
          </SidebarHeader>
          <Divider />
          <SidebarContent className="flex h-[calc(100vh-64px)] flex-col overflow-y-auto px-3">
            <div className="flex-1">
              <NavMain items={navItems} variant="retro" />
              {!isConnected && (
                <RetroButton
                  className="h-9 w-full whitespace-nowrap font-pixel-operator"
                  onClick={() => open()}
                >
                  Connect Wallet
                </RetroButton>
              )}
            </div>
            {isConnected && (
              <Window
                title={formatEthereumAddress(address)}
                className="!h-[200px]"
                onTitleClick={() => {
                  if (!address) return;
                  try {
                    navigator.clipboard.writeText(address);
                    toast.success("Copied to clipboard!");
                  } catch (err) {
                    toast.error("Failed to copy address");
                  }
                }}
              >
                {isConnected && (
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-2xl font-bold">
                      {supportedTokens.length > 0
                        ? convertWeiToEther(supportedTokens[0].balance || 0)
                        : "0"}{" "}
                      {networks[0].nativeCurrency.symbol}
                    </span>
                  </div>
                )}

                {isConnected && !isSyncMessage && (
                  <div className="flex gap-2 mt-5">
                    {/* <Button
                      className="bg-retro-gray ring-4 ring-retro-black/20 border-r-4 border-r-black border-b-4 border-b-black border-l-2 border-l-white border-t-2 border-t-white p-2 text-left flex items-center space-x-4 hover:bg-gray-400 active:border-l-black active:border-t-black active:border-r-white active:border-b-white"
                      onClick={() => signMessageWithSign()}
                    >
                      Verify Wallet
                    </Button> */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-red-500 text-white hover:bg-red-800"
                      onClick={() => disconnect()}
                    >
                      <LogOut />
                    </Button>
                  </div>
                )}

                {isConnected && isSyncMessage && (
                  <Button
                    variant="outline"
                    className="w-full bg-red-500 text-white hover:bg-red-800 mt-5"
                    onClick={() => disconnect()}
                  >
                    Disconnect <LogOut className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </Window>
            )}
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  );
}
