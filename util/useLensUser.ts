import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../graphql/initClient";
import getProfileByAddress from "../graphql/query/getProfileByAddress";

export default function useLensUser() {
  const address = useAddress();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const localStorageValue = localStorage.getItem(STORAGE_KEY);
    const auth = localStorageValue ? JSON.parse(localStorageValue) : null;

    if (auth) {
      const expired = auth.exp < Date.now() / 1000;
      setIsSignedIn(!expired);
    } else {
      setIsSignedIn(false);
    }

    setLoadingSignIn(false);
  }, [address, typeof window]);

  const { data: profile, isLoading: loadingProfile } = useQuery(
    ["profile", address],
    () => getProfileByAddress(address as string),
    {
      enabled: !!address && isSignedIn,
    }
  );

  return {
    isSignedIn,
    loadingSignIn,
    profile,
    loadingProfile,
  };
}
