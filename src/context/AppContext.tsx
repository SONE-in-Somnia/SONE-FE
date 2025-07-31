import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

import { AuthProvider } from "./AuthContext";
import { headers } from "next/headers";
import ContextProvider from "./WalletContext";
import { KuroProvider } from "./KuroContext";
import { SocketProvider } from "./SocketContext";

const AppContext = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <ContextProvider cookies={cookies}>
      <AuthProvider>
        <SocketProvider>
          <KuroProvider>
            {children}
            <ToastContainer
              autoClose={5000}
              position="bottom-right"
              theme="dark"
              stacked
            />

            <NextTopLoader
              showSpinner={false}
              height={3}
              zIndex={1000}
              color="#8371E9"
            />
          </KuroProvider>
        </SocketProvider>
      </AuthProvider>
    </ContextProvider>
  );
};

export default AppContext;
