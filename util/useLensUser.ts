import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../graphql/initClient";
import getProfileByAddress from "../graphql/query/getProfileByAddress";

/**
 * Hook to load the currently signed in Lens user's profile.
 * Returns:
 * - isSignedIn: If they are currently authenticated and their token hasn't expired
 * - loadingSignin: If we are currently checking if they are signed in
 * - profile: The profile of the currently signed in user
 * - loadingProfile: If we are currently loading the profile
 */
export default function useLensUser() {
  const address = useAddress();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Read their access token from local storage
    const localStorageValue = localStorage.getItem(STORAGE_KEY);

    // Boolean flag to see if they have any authentication information stored in local storage
    const auth = localStorageValue ? JSON.parse(localStorageValue) : null;

    // If they do, check if their access token has expired
    if (auth) {
      // If it has, we say they're not signed in.
      const expired = auth.exp < Date.now() / 1000;
      setIsSignedIn(!expired);
    } else {
      setIsSignedIn(false);
    }

    setLoadingSignIn(false);
  }, [address]);

  // If they're signed in, we load their profile by querying the API
  const { data: profile, isLoading: loadingProfile } = useQuery(
    ["profile", address],
    () => getProfileByAddress(address as string),
    {
      enabled: !!address && isSignedIn,
    }
  );

  return {
    isSignedIn,
    setIsSignedIn,
    loadingSignIn,
    profile,
    loadingProfile,
  };
}
