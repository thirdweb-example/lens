import { createClient as createUrqlClient } from "urql";
import { refreshAccessToken } from "./auth/refreshAccessToken";

// The base graphql endpoint
export const APIURL = "https://api.lens.dev";

// The key we use to store the access token + refresh token + expiry in local storage`
export const STORAGE_KEY = "LH_STORAGE_KEY";

// The contract address of the Lens smart contract
export const LENS_HUB_CONTRACT_ADDRESS =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

// Export a basic unauthenticated client for read operations
export const basicClient = createUrqlClient({
  url: APIURL,
});

// Create an authenticated client on behalf of the current user.
export async function createClient() {
  // Read their access token from local storage
  const localStorageValue = localStorage.getItem(STORAGE_KEY);

  // If we can't find one, the user is not logged in. Return the basic client.
  if (!localStorageValue) {
    return basicClient;
  }

  // Same as above, but we parse the JSON
  const storageData = JSON.parse(localStorageValue);
  if (!storageData) {
    return basicClient;
  }

  // Get a fresh access token by using the refresh token that we just read from storage.
  const accessTokenReq = await refreshAccessToken();
  if (!accessTokenReq) {
    return basicClient;
  }

  // Create a new authenticated client with the new access token as the auth header
  const urqlClient = createUrqlClient({
    url: APIURL,
    fetchOptions: {
      headers: {
        "x-access-token": `Bearer ${accessTokenReq.accessToken}`,
      },
    },
  });
  return urqlClient;
}
