"use client";
import { calculateTimeLeft } from "@/utils/string";
import { useEffect, useState } from "react";

interface CountdownProps {
  deadline: string; // Thời gian hết hạn (YYYY-MM-DD HH:MM:SS)
  isEnded?: boolean; // Prop này vẫn giữ lại để tương thích với code hiện tại
}

export default function CountdownBoxes({ deadline }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  // Kiểm tra xem thời gian đã hết chưa (tất cả đều là "00")
  const isTimeEnded =
    timeLeft.days === "00" &&
    timeLeft.hours === "00" &&
    timeLeft.minutes === "00" &&
    timeLeft.seconds === "00";

  // Sử dụng màu khác nhau dựa vào trạng thái thời gian
  const textColorClass = isTimeEnded ? "text-warning" : "text-[#8BD34C]";

  return (
    <div className={`flex items-center gap-1 text-lg font-bold ${textColorClass}`}>
      {[
        { label: "d", value: timeLeft.days },
        { label: "h", value: timeLeft.hours },
        { label: "m", value: timeLeft.minutes },
        { label: "s", value: timeLeft.seconds },
      ].map((unit, index) => (
        <div key={unit.label} className="flex items-center">
          <div className="flex items-center justify-center rounded-md">
            <p className="text-xs font-semibold">
              {unit.value} {unit.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
