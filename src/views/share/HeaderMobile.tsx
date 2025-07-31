"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeaderMobile = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="lg:hidden">
      <div className="flex items-center px-3 py-2">
        <AlignJustify
          onClick={() => setOpenMobile(true)}
          className="h-6 w-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default HeaderMobile;
