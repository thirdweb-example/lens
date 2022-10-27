import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "../styles/globals.css";
import Header from "../components/Header/Header";

export default function App({ Component, pageProps }: AppProps) {
  // Initialize React Query Client
  const queryClient = new QueryClient();

  // Specify what network you're going to interact with
  const desiredChainId = ChainId.Polygon;

  return (
    // For thirdweb functionality
    <ThirdwebProvider desiredChainId={desiredChainId}>
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
