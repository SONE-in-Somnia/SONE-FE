import type { Metadata } from "next";
import Image from "next/image";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import AppContext from "@/context/AppContext";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "react-toastify/dist/ReactToastify.css";

import HeaderMobile from "@/views/share/HeaderMobile";
import Notifier from "@/components/customized/notifier";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "SONE",
  description:
    "Discover an exciting Web3 gaming platform that brings a collection of thrilling mini-games powered by blockchain technology. Dive into a decentralized world where you can play, compete, and earn unique digital rewards. Our platform offers a variety of fast-paced, engaging mini-games, from strategy puzzles to action-packed challenges, all seamlessly integrated with Web3 wallets for secure transactions and NFT-based rewards. Enjoy a fun, transparent, and rewarding gaming experience with vibrant graphics and community-driven leaderboards, all while exploring the future of gaming in the Web3 ecosystem.",
  icons: "/images/logo.svg",
};

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// });

const modernWarfare = localFont({
  src: "../../public/fonts/MODERNWARFARE.ttf",
  variable: "--font-modern-warfare",
});
const pixelOperator = localFont({
  src: "../../public/fonts/PixelOperator.ttf",
  variable: "--font-pixel-operator",
});

const pixelOperatorMono = localFont({
  src: "../../public/fonts/PixelOperatorMono.ttf",
  variable: "--font-pixel-operator-mono",
});

const pixelOperatorMonoBold = localFont({
  src: "../../public/fonts/PixelOperatorMono8-Bold.ttf",
  variable: "--font-pixel-operator-mono-bold",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(
              function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M3NX2RHQ');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`containers relative antialiased ${pixelOperator.variable} ${pixelOperatorMono.variable} ${pixelOperatorMonoBold.variable} ${modernWarfare.variable}`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3NX2RHQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <AppContext>
          <Image
            src="/images/WTTIGIF.gif"
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="-z-10"
          />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <HeaderMobile />
              <div className="relative mx-auto flex w-full flex-1 flex-col gap-4 font-pixel-operator">
                <Notifier />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
                <div className="p-4">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </AppContext>
      </body>
    </html>
  );
}
