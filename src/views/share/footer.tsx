'use client'

import Link from "next/link";
import AnimationContainer from "../../components/shapexui/animation-container";
import { Circle, Instagram, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useGetCurrentBlock from "@/api/useGetCurrentBlock";
import { useEffect, useState } from "react";
import { RxDiscordLogo } from "react-icons/rx";

const footerLink = [
  {
    name: "About",
    link: "#",
  },
  {
    name: "Contact",
    link: "3",
  },
  {
    name: "FAQ",
    link: "#",
  },
  {
    name: "Privacy Policy",
    link: "#",
  },
  {
    name: "Terms and Conditions",
    link: "#",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const _getCurrentBlock = useGetCurrentBlock()
  const [currentBlock, setCurrentBlock] = useState(0);

  const fetchCurrentBlock = async () => {
    const res = await _getCurrentBlock.mutateAsync()
    setCurrentBlock(res.block.number || 0)
  }

  useEffect(() => {
    fetchCurrentBlock()
  }, []);

  return (
    <footer className="w-full bg-background/20 sticky bottom-0 backdrop-blur-md">
      <div className=" pt-2 pb-2 w-full max-w-[1366px] px-20 mx-auto">
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div> */}

        <div className="flex flex-col items-center space-y-8 md:flex-row md:justify-between md:space-y-0">
          <AnimationContainer delay={0.2} className="mt-8 md:mt-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <Logo /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <p
                  className="text-xl font-semibold  text-primary tracking-wide"
                  style={{ fontVariationSettings: '"opsz" 32' }}
                >
                  Fuku
                </p> */}

                <Image src='/images/logo_fuku.svg' alt="" width={200} height={30} />
              </div>
            </Link>
          </AnimationContainer>

          {/* <AnimationContainer className="w-full md:w-auto">
            <nav className="flex flex-wrap justify-center gap-4 text-center md:justify-end">
              {footerLink.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-xs leading-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </AnimationContainer> */}

          <AnimationContainer
            delay={0.1}
            className="flex justify-center items-center space-x-4"
          >

            <div className="flex items-center gap-2 text-sm rounded p-2 ">
              <Circle size={14} color="#33ff52" strokeWidth={3} />
              <p className="opacity-50">Current sync block:</p>
              <p className="font-semibold">{currentBlock.toLocaleString()}</p>
            </div>

            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://discord.gg/sXWz9mswWs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RxDiscordLogo />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://x.com/Fuku_nad"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src='/images/x.svg' alt="" width={20} height={20} />
              </Link>
            </Button>
          </AnimationContainer>
        </div>

        <AnimationContainer
          delay={0.6}
          className="mt-2 border-t border-border/40 pt-2 px-4 sm:px-6 lg:px-8"
        >
          <div className="flex justify-center">
            <p className="text-xs leading-5 text-muted-foreground text-center">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>
        </AnimationContainer>
      </div>
    </footer>
  );
};

export default Footer;
