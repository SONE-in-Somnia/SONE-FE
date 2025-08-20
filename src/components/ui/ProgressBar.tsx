// src/components/ui/ProgressBar.tsx
'use client';
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  startTime: number;
  endTime: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ startTime, endTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = Date.now() / 1000;
      const totalDuration = endTime - startTime;
      const elapsedTime = now - startTime;
      const calculatedProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(calculatedProgress);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div className="w-full bg-retro-gray border-2 border-t-black border-l-black border-b-white border-r-white p-1">
      <div
        className="bg-retro-orange h-6 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;