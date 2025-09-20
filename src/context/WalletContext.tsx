"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  PersistQueryClientOptions,
} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { somniaTestnet } from "@/config/chains";

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a default cache time for all queries
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      // Add a default retry policy for failed queries
      retry: 2, // Retry failed requests up to 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff delay
    }
  }
});

// Create a persister that uses localStorage
const localStoragePersister = createAsyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

const persistOptions: PersistQueryClientOptions = {
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
  buster: process.env.NEXT_PUBLIC_APP_VERSION || "1.0", // Bust cache on new app version
}

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "fukunad",
  description: "Fukunad",
  url: "https://testnet.fukunad.xyz",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [somniaTestnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  themeVariables: {
    "--w3m-border-radius-master": "1px",
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
      reconnectOnMount={true}
    >
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>{children}</PersistQueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
