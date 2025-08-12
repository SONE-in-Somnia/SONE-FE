import React from "react";
import { cn } from "@/lib/utils";

interface WindowProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  onTitleClick?: () => void;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  className,
  headerClassName,
  onTitleClick,
}) => {
  return (
    <div
      className={cn(
        "border-r-4 border-r-black border-b-4 border-b-black border-l-2 border-l-white border-t-2 border-t-white h-full flex flex-col font-pixel-operator-mono",
        className,
      )}
    >
      <div
        className={cn(
          "bg-retro-blue text-white p-1 flex justify-between items-center flex-shrink-0",
          headerClassName,
          onTitleClick ? "cursor-pointer" : ""
        )}
        onClick={onTitleClick}
      >
        {typeof title === "string" ? (
          <h2 className="text-[16px] font-pixel-operator-mono font-bold">
            {title}
          </h2>
        ) : (
          title
        )}
      </div>
      <div className="bg-retro-gray py-4 px-3 flex-grow overflow-y-auto font-pixel-operator-mono font-thin h-full">
        {children}
      </div>
    </div>
  );
};

export default Window;
