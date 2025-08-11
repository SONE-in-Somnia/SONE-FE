import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const RetroButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "font-bold bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white px-4 py-1 ring-4 ring-retro-black/20 text-black hover:bg-gray-400 active:border-l-black active:border-t-black active:border-r-white active:border-b-white",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
RetroButton.displayName = "RetroButton";

export { RetroButton };
