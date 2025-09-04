"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: number; // Expect a timestamp in milliseconds
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ endTime, onComplete }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - new Date().getTime();

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        return { days: d, hours: h, minutes: m, seconds: s };
      } else {
        if (onComplete) onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    const updateCountdown = () => {
      const { days: d, hours: h, minutes: m, seconds: s } = calculateTimeLeft();
      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    };

    updateCountdown(); // Initial call

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-max text-xs text-retro-gray-2 justify-center items-center">
      <div className="flex flex-col">
        <span className="countdown text-lg">
          <span className='bg-retro-orange text-white' style={{ "--value": days } as React.CSSProperties} aria-live="polite" aria-label={`${days} days`}>{days}</span>
        </span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown text-lg">
          <span className='bg-retro-orange text-white' style={{ "--value": hours } as React.CSSProperties} aria-live="polite" aria-label={`${hours} hours`}>{hours}</span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown text-lg">
          <span className='bg-retro-orange text-white' style={{ "--value": minutes } as React.CSSProperties} aria-live="polite" aria-label={`${minutes} minutes`}>{minutes}</span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown text-lg">
          <span className='bg-retro-orange text-white' style={{ "--value": seconds } as React.CSSProperties} aria-live="polite" aria-label={`${seconds} seconds`}>{seconds}</span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Countdown;
