import React from "react";
import { cn } from "@/lib/utils";

interface RetroPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  headerContent?: React.ReactNode;
}

const RetroPanel: React.FC<RetroPanelProps> = ({ title, children, className, headerClassName, headerContent }) => {
  return (
    <div className={cn("bg-retro-gray border-r-4 border-r-black border-b-4 border-b-black border-l-2 border-l-white border-t-2 border-t-white h-full flex flex-col font-pixel-operator-mono", className)}>
      <div className={cn("flex items-center justify-between p-1", headerClassName)}>
        <h2 className="font-pixel-operator-mono font-bold text-sm uppercase text-white">
          {title}
        </h2>
        {headerContent}
      </div>
      <div className="bg-retro-gray p-2">{children}</div>
    </div>
  );
};

export default RetroPanel;
