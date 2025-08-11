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
        "flex h-full flex-col border-b-4 border-l-2 border-r-4 border-t-2 border-b-black border-l-white border-r-black border-t-white font-pixel-operator-mono",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-between bg-retro-blue p-1 text-white",
          headerClassName,
          onTitleClick ? "cursor-pointer" : "",
        )}
        onClick={onTitleClick}
      >
        {typeof title === "string" ? (
          <h2 className="font-pixel-operator-mono text-[16px] font-bold">
            {title}
          </h2>
        ) : (
          title
        )}
      </div>
      <div className="h-full flex-grow overflow-y-auto bg-retro-gray px-3 py-4 font-pixel-operator-mono font-thin">
        {children}
      </div>
    </div>
  );
};

export default Window;
