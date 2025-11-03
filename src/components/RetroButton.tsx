import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const RetroButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex items-center justify-center border-4 border-b-black border-l-white border-r-black border-t-white bg-retro-gray px-4 py-1 font-bold text-black ring-4 ring-retro-black/20 hover:bg-gray-400 active:border-b-white active:border-l-black active:border-r-white active:border-t-black disabled:cursor-not-allowed disabled:bg-retro-gray-2 disabled:text-retro-gray-4",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
RetroButton.displayName = "RetroButton";

export { RetroButton };
