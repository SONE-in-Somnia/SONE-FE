"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: number; // Expect a timestamp in milliseconds
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ endTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - new Date().getTime();
      let newTimeLeft = "";

      if (difference > 0) {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        newTimeLeft = `${minutes}m : ${seconds < 10 ? "0" : ""}${seconds}s`;
      } else {
        if (onComplete) onComplete();
        return "0m : 00s";
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  return <span>{timeLeft}</span>;
};

export default Countdown;
