import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import Header from "../components/Header/Header";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // Initialize React Query Client
  const queryClient = new QueryClient();

  // Specify what network you're going to interact with
  const activeChain = "mumbai";

  return (
    // For thirdweb functionality
    <ThirdwebProvider activeChain={activeChain}>
      {/* For React Query functionality */}
      <QueryClientProvider client={queryClient}>
        {/* For React Query supporting SSR */}
        <Hydrate state={pageProps.dehydratedState}>
          <Header />
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
