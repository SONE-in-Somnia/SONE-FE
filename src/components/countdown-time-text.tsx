import { getTimeUntilWithdraw } from "@/utils/string";
import { useState, useEffect } from "react";

interface CountdownProps {
  withdrawalTime: string | number | null | undefined;
}

const CountdownTimerText: React.FC<CountdownProps> = ({ withdrawalTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const time = getTimeUntilWithdraw(withdrawalTime);
      setTimeLeft(time);
    };

    updateCountdown(); // Initialize immediately

    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [withdrawalTime]);

  return (
    <p className="text-foreground opacity-50 text-sm ml-6">
      Withdraw time: <span>{timeLeft}</span>
    </p>
  );
};

// Example usage in your component
// <CountdownTimer withdrawalTime={pool?.withdrawalTime} />

export default CountdownTimerText;
