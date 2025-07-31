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

// This is sample data.
const data = {
  navMain: [
    {
      title: "Discover",
      url: "/",
      iconName: "globe",
      isActive: true,
      group: "main",
    },
    {
      title: "Rewards",
      url: "/rewards",
      iconName: "medal",
      group: "main",
    },
    {
      title: "Kuro",
      url: "/kuro",
      iconName: "circle-dot-dashed",
      group: "games",
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      iconName: "align-end-horizontal",
      group: "social",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isConnected, address } = useAppKitAccount();
  const { setOpenMobile, openMobile, isMobile } = useSidebar();
  const { open, close } = useAppKit();
  const { user, signMessageWithSign, isSyncMessage, supportedTokens } =
    useAuth();
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
          className={`h-full rounded-xl bg-white max-lg:bg-background`}
          {...props}
        >
          <SidebarHeader className="">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="px-2">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/images/logo.svg"
                    width={32}
                    height={32}
                    alt="logo"
                    priority
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
              <NavMain items={navItems} />
              {/* Nút Connect Wallet luôn nằm dưới item cuối cùng của navbar */}
              {!isConnected && (
                <Button
                  className="h-9 w-full whitespace-nowrap bg-gradient-to-r from-[#E83C61] to-[#9950E9] text-white"
                  onClick={() => open()}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </SidebarContent>

          <div className="p-2">
            <SidebarFooter
              className={`rounded-xl p-4 ${isConnected && "bg-background"}`}
            >
              {isConnected && (
                <div className="flex items-center justify-between gap-1">
                  <span
                    onClick={() => {
                      if (!address) return;
                      try {
                        navigator.clipboard.writeText(address);
                        toast.success("Copied to clipboard!");
                      } catch (err) {
                        toast.error("Failed to copy address");
                      }
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    {formatEthereumAddress(address)}
                  </span>
                  <span className="text-lg font-bold">
                    {supportedTokens.length > 0
                      ? convertWeiToEther(supportedTokens[0].balance || 0)
                      : "0"}{" "}
                    {networks[0].nativeCurrency.symbol}
                  </span>
                </div>
              )}

              {isConnected && !isSyncMessage && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 rounded-lg bg-gradient-to-r from-[#E83C61] to-[#9950E9] text-white"
                    onClick={() => signMessageWithSign()}
                  >
                    Verify Wallet
                  </Button>
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
                  className="w-full rounded-lg bg-red-500 text-white hover:bg-red-800"
                  onClick={() => disconnect()}
                >
                  Disconnect <LogOut className="ml-1 h-4 w-4" />
                </Button>
              )}
            </SidebarFooter>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
