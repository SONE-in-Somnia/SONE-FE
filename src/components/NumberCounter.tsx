"use client";
// components/NumberCounter.jsx
import { useState, useEffect } from "react";

interface NumberCounterProps {
  targetValue: number;
  className?: string;
  duration?: number;
  steps?: number;
  toFixed?: number;
  symbol?: string;
}

const NumberCounter: React.FC<NumberCounterProps> = ({
  targetValue,
  className,
  duration = 1000,
  steps = 60,
  toFixed = 2,
  symbol = "",
}) => {
  const [count, setCount] = useState<string>("0");

  useEffect(() => {
    const increment = targetValue / steps;
    let currentStep = 0;

    const counter = setInterval(() => {
      currentStep++;
      setCount(
        Math.min(Math.round(currentStep * increment), targetValue).toFixed(
          toFixed,
        ),
      );

      if (currentStep >= steps) {
        clearInterval(counter);
        setCount(targetValue.toFixed(toFixed));
      }
    }, duration / steps);

    return () => clearInterval(counter);
  }, [targetValue, duration, steps]);

  // Format number with commas
  const formatNumber = (num: string) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <p className={className}>
      {symbol}
      {formatNumber(count)}
    </p>
  );
};

export default NumberCounter;
