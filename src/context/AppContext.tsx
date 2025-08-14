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
              color="#fff"
              crawl={true}
              showSpinner={false}
              height={5}
              zIndex={1000}
            />
          </KuroProvider>
        </SocketProvider>
      </AuthProvider>
    </ContextProvider>
  );
};

export default AppContext;
