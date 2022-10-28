import { createClient as createUrqlClient } from "urql";
import { refreshAccessToken } from "./auth/refreshAccessToken";

export const APIURL = "https://api.lens.dev";
export const STORAGE_KEY = "LH_STORAGE_KEY";
export const LENS_HUB_CONTRACT_ADDRESS =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export const basicClient = createUrqlClient({
  url: APIURL,
});

export async function createClient() {
  const localStorageValue = localStorage.getItem(STORAGE_KEY);

  if (!localStorageValue) {
    return basicClient;
  }

  const storageData = JSON.parse(localStorageValue);

  if (!storageData) {
    return basicClient;
  }

  const accessTokenReq = await refreshAccessToken();

  if (!accessTokenReq) {
    return basicClient;
  }

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
