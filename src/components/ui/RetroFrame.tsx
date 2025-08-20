// src/components/ui/RetroFrame.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface RetroFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const RetroFrame: React.FC<RetroFrameProps> = ({ children, className, title }) => {
  return (
    <div
      className={cn(
        'border-r-4 border-r-black border-b-4 border-b-black border-l-2 border-l-white border-t-2 border-t-white font-pixel-operator-mono',
        className
      )}
    >
      <div className="bg-retro-yellow text-retro-blue p-1 flex justify-between items-center">
        <h2 className="text-[16px] font-pixel-operator-mono font-bold pl-1">
          {title}
        </h2>
        <div className="flex items-center">
          <button className="mr-1 w-6 h-6 bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white flex items-center justify-center text-black pointer-events-none">
            _
          </button>
          <button className="w-6 h-6 bg-retro-gray border-2 border-r-black border-b-black border-l-white border-t-white flex items-center justify-center text-black pointer-events-none">
            X
          </button>
        </div>
      </div>
      <div className="bg-retro-gray p-4">{children}</div>
    </div>
  );
};

export default RetroFrame;