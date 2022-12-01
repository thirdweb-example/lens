import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "../styles/globals.css";
import Header from "../components/Header/Header";
import Script from "next/script";

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
          <div className="relative min-h-screen pb-[10rem]">
            <Header />
            <div className='flex justify-center'>
              <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></Script>
              <Script id="google-analytics" strategy="lazyOnload">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                });
              `}
              </Script>
              <Component className="pb-[10rem]" {...pageProps} />
            </div>
            <footer>
              <div className="w-full h-[10rem] bg-base-300 absolute bottom-0">
                <div className="flex h-full justify-center items-center">
                  <p className="text-xl">
                    Made with ☕ by <a className="text-secondary hover:text-primary" href="https://lenster.xyz/u/adewale.lens" target="_blank" rel="noreferrer">@adewale</a>
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Hydrate>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
