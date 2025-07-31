"use client";
import { JackpotRound } from "@/types/round";
import JackpotWinningOverlay from "@/views/magic-earn/JackpotWinningOverlay";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket as SocketIOClient } from "socket.io-client";

interface SocketContextProps {
  socket: SocketIOClient | null;
  reconnectSocket: () => void;
  registerSocketListener: (
    listenName: string,
    callback: (...args: any[]) => void,
  ) => void;
  unRegisterSocketListener: (
    listenName: string,
    callback: (...args: any[]) => void,
  ) => void;

  // jackpot socket
  jackpotRoundData: JackpotRound | null;
  jackpotWinnerData: JackpotRound | null;
  setJackpotWinnerData: Dispatch<SetStateAction<JackpotRound | null>>;
}

interface SocketProviderProps {
  children: ReactNode;
}

// Tạo context
const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const socketServerUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

  // jackpot socket
  const [jackpotRoundData, setJackpotRoundData] = useState<JackpotRound | null>(
    null,
  );
  const [jackpotWinnerData, setJackpotWinnerData] =
    useState<JackpotRound | null>(null);

  const connectToSocket = useCallback(() => {
    try {
      if (socket) {
        socket.disconnect();
      }

      if (reconnectAttempts >= 5) {
        toast.error(
          "Maximum reconnection attempts reached (5). Please try again later.",
        );

        return;
      }

      const newSocket = io(socketServerUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      // Lưu socket
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error("Error connecting to socket:", error);
      toast.error(
        `Error connecting to socket: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }, [socketServerUrl, reconnectAttempts]);

  const disconnectFromSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  const reconnectSocket = useCallback(() => {
    console.log("Attempting to reconnect socket...");
    disconnectFromSocket();
    setReconnectAttempts(0);
    connectToSocket();
  }, [disconnectFromSocket, connectToSocket]);

  const registerSocketListener = useCallback(
    (listenName: string, callback: (...args: any[]) => void) => {
      if (!socket) return;

      // Xóa các listener cũ
      socket.off(listenName);

      // Đăng ký listener mới
      socket.on(listenName, callback);
    },
    [socket],
  );

  const unRegisterSocketListener = useCallback(
    (listenName: string, callback: (...args: any[]) => void) => {
      if (!socket) return;

      // Xóa các listener cũ
      socket.off(listenName, callback);
    },
    [socket],
  );

  const listenConnect = useCallback(() => {
    console.log("Connected to socket server");
    setReconnectAttempts(0);
    toast.success("Connected to websocket server");
  }, []);

  const listenDisconnect = useCallback(() => {
    console.log("Disconnected from socket server");
    toast.info("Disconnected from websocket server");
  }, []);

  const listenConnectError = useCallback(
    (error: Error) => {
      console.error("Socket connection error:", error);
      setReconnectAttempts((prev) => prev + 1);
      toast.error(
        `Connection error: ${error.message}. Attempt ${reconnectAttempts + 1}/5`,
      );
    },
    [reconnectAttempts],
  );

  const listenReconnectFailed = useCallback(() => {
    console.error("Socket reconnection failed after 5 attempts");
    toast.error(
      "Failed to reconnect after 5 attempts. Please try again later.",
    );
    setReconnectAttempts(5);
  }, []);

  const listenReconnectAttempt = useCallback((attempt: number) => {
    console.log(`Reconnection attempt ${attempt}/5`);
    toast.info(`Attempting to reconnect: ${attempt}/5`);
  }, []);

  // jackpot socket global
  const handleJackpotRoundUpdated = useCallback((data: JackpotRound) => {
    console.log("Received Jackpot round updated:", data);
    setJackpotRoundData(data);
  }, []);

  const handleJackpotWinnerAnnounced = useCallback((data: JackpotRound) => {
    console.log("Received Jackpot winner announced:", data);
    setJackpotWinnerData(data);
  }, []);

  useEffect(() => {
    connectToSocket();

    return () => {
      disconnectFromSocket();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Xóa các listener cũ
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("reconnect_failed");
    socket.off("reconnect_attempt");
    socket.off("jackpotRoundUpdated");
    socket.off("jackpotWinnerAnnounced");

    // Đăng ký listener mới
    registerSocketListener("connect", listenConnect);
    registerSocketListener("disconnect", listenDisconnect);
    registerSocketListener("connect_error", listenConnectError);
    registerSocketListener("reconnect_failed", listenReconnectFailed);
    registerSocketListener("reconnect_attempt", listenReconnectAttempt);
    registerSocketListener("jackpotRoundUpdated", handleJackpotRoundUpdated);
    registerSocketListener(
      "jackpotWinnerAnnounced",
      handleJackpotWinnerAnnounced,
    );

    // Cleanup khi socket thay đổi hoặc poolStatus thay đổi
    return () => {
      unRegisterSocketListener("connect", listenConnect);
      unRegisterSocketListener("disconnect", listenDisconnect);
      unRegisterSocketListener("connect_error", listenConnectError);
      unRegisterSocketListener("reconnect_failed", listenReconnectFailed);
      unRegisterSocketListener("reconnect_attempt", listenReconnectAttempt);
      unRegisterSocketListener(
        "jackpotRoundUpdated",
        handleJackpotRoundUpdated,
      );
      unRegisterSocketListener(
        "jackpotWinnerAnnounced",
        handleJackpotWinnerAnnounced,
      );
    };
  }, [
    socket,
    listenConnect,
    listenDisconnect,
    listenConnectError,
    listenReconnectFailed,
    listenReconnectAttempt,
    handleJackpotRoundUpdated,
    handleJackpotWinnerAnnounced,
  ]);

  // Context value
  const value: SocketContextProps = {
    socket,
    reconnectSocket,
    registerSocketListener,
    unRegisterSocketListener,

    // jackpot socket
    jackpotRoundData,
    jackpotWinnerData,
    setJackpotWinnerData,
  };

  return (
    <SocketContext.Provider value={value}>
      {jackpotWinnerData && <JackpotWinningOverlay />}
      {children}
    </SocketContext.Provider>
  );
};

// Hook để sử dụng context
export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
