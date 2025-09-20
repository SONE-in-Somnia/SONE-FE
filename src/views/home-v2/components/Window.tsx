import React from "react";
import { cn } from "@/lib/utils";

interface WindowProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string; // New prop for inner content div
  onTitleClick?: () => void;
  showCloseButton?: boolean;
  showMinimizeButton?: boolean;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  className,
  headerClassName,
  contentClassName, // Destructure new prop
  onTitleClick,
  showCloseButton,
  showMinimizeButton,
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
          "flex flex-shrink-0 items-center justify-between bg-retro-blue p-1 text-white",
          headerClassName,
        )}
      >
        <div
          className={cn("flex-grow", onTitleClick ? "cursor-pointer" : "")}
          onClick={onTitleClick}
        >
          {typeof title === "string" ? (
            <h2 className="text-[16px] font-pixel-operator-mono font-bold pl-1">
              {title}
            </h2>
          ) : (
            title
          )}
        </div>
        <div className="flex items-center">
          {showMinimizeButton && (
            <button
              className="mr-1 w-6 h-6 bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white flex items-center justify-center text-black"
            >
              _
            </button>
          )}
          {showCloseButton && (
            <button
              className="w-6 h-6 bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white flex items-center justify-center text-black"
            >
              X
            </button>
          )}
        </div>
      </div>
      <div className={cn("bg-retro-gray py-4 px-3 flex-grow overflow-y-auto font-pixel-operator-mono font-thin h-full", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default Window;
