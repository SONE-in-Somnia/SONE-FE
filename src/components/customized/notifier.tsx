"use client";

import { useSocket } from "@/context/SocketContext";
import { convertWeiToEther, formatEthereumAddress } from "@/utils/string";
import { useEffect, useRef, useState } from "react";

export enum SocketNotifyTypeEnum {
  KURO_WINNER_BIG_AMOUNT = "kuro_winner_big_amount",
}

export interface SocketNotifyType<T> {
  message: string;
  speed?: number;
  loops?: number;
  data: T;
  type: SocketNotifyTypeEnum;
}

export interface NotifyKuroWinner {
  winner: string;
  totalValue: string;
  roundId: string;
}

const Notifier = () => {
  const { socket, registerSocketListener, unRegisterSocketListener } =
    useSocket();

  const [notifications, setNotifications] = useState<SocketNotifyType<any>[]>(
    [],
  );
  const [currentNotification, setCurrentNotification] =
    useState<SocketNotifyType<any> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const animationRef = useRef<any>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sử dụng useRef để lưu trữ trạng thái animation
  const animationStateRef = useRef({
    position: 0,
    completedLoops: 0,
    isAnimating: false,
  });

  // Xử lý animation
  useEffect(() => {
    if (!currentNotification) return;

    const animate = () => {
      const container = containerRef.current;
      const text = textRef.current;

      if (!container || !text) return;

      const containerWidth = container.offsetWidth;
      const textWidth = text.offsetWidth;

      // Chỉ reset position khi bắt đầu thông báo mới
      if (!animationStateRef.current.isAnimating) {
        animationStateRef.current.position = containerWidth;
        animationStateRef.current.completedLoops = 0;
        animationStateRef.current.isAnimating = true;
        text.style.transform = `translateX(${containerWidth}px)`;
      }

      const speed = currentNotification.speed || 10;
      const loops = currentNotification.loops || 1;

      const moveText = () => {
        if (isPaused) {
          animationRef.current = requestAnimationFrame(moveText);
          return;
        }

        animationStateRef.current.position -= speed / 10;
        text.style.transform = `translateX(${animationStateRef.current.position}px)`;

        if (animationStateRef.current.position <= -textWidth) {
          animationStateRef.current.completedLoops++;

          // Kiểm tra nếu đã hoàn thành đủ số vòng lặp
          if (animationStateRef.current.completedLoops >= loops) {
            // Reset animation state
            animationStateRef.current.isAnimating = false;

            // Hoàn thành thông báo hiện tại
            setTimeout(() => {
              // Xóa thông báo đã hoàn thành và chuyển sang thông báo tiếp theo
              setNotifications((currentQueue) => {
                const nextNotifications = currentQueue.slice(1);
                if (nextNotifications.length > 0) {
                  setCurrentNotification(nextNotifications[0]);
                } else {
                  setCurrentNotification(null);
                  setIsVisible(false);
                }
                return nextNotifications;
              });
            }, 100);
            return; // Dừng animation
          }

          animationStateRef.current.position = containerWidth; // Reset vị trí cho vòng lặp tiếp theo
        }

        animationRef.current = requestAnimationFrame(moveText);
      };

      animationRef.current = requestAnimationFrame(moveText);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentNotification, isPaused]);

  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setIsVisible(true);
    }
  }, [notifications, currentNotification]);

  const addNotification = (data: SocketNotifyType<any>) => {
    console.log("🚀 ~ addNotification ~ data:", data);

    setNotifications((prev) => [...prev, data]);
  };

  const getNotificationStyle = (notification: SocketNotifyType<any>) => {
    switch (notification.type) {
      case SocketNotifyTypeEnum.KURO_WINNER_BIG_AMOUNT:
        const notify: SocketNotifyType<NotifyKuroWinner> = notification;
        return (
          <div>
            Winner{" "}
            <span className="font-bold text-accept">
              {formatEthereumAddress(notify?.data?.winner) || "-"}
            </span>{" "}
            has won{" "}
            <span className="font-bold text-primary">
              {convertWeiToEther(notify.data.totalValue || 0)}
            </span>{" "}
            MON in Kuro game!
          </div>
        );
      case 'success':
        return <div className="text-retro-green">{notification.message || ""}</div>;
      case 'error':
        return <div className="text-retro-red">{notification.message || ""}</div>;
      default:
        return <div>{notification.message || ""}</div>;
    }
  };

  useEffect(() => {
    registerSocketListener("notification", addNotification);

    return () => {
      unRegisterSocketListener("notification", addNotification);
    };
  }, [socket]);

  return (
    <div className="fixed left-0 right-0 top-2 z-10">
      {/* Banner thông báo */}
      {isVisible && (
        <div className="overflow-hidden text-white shadow-lg">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative flex h-fit items-center rounded transition-all hover:bg-white/10 hover:backdrop-blur-xl"
            style={{ width: "100%" }}
          >
            <div
              ref={textRef}
              className="whitespace-nowrap px-4 font-semibold"
              style={{ willChange: "transform" }}
            >
              {currentNotification && getNotificationStyle(currentNotification)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifier;
