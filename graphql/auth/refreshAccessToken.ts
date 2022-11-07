import parseJwt from "../../util/parseJwt";
import { basicClient, STORAGE_KEY } from "../initClient";

const refreshMutation = `
  mutation Refresh(
    $refreshToken: Jwt!
  ) {
    refresh(request: {
      refreshToken: $refreshToken
    }) {
      accessToken
      refreshToken
    }
  }
`;

/**
 * An access token is sent to the API to authenticate the user.
 * The access token expires after 30 minutes.
 * The refresh token can be used to get a new access token.
 * This function loads the refresh token from local storage and uses it to get a new access token.
 */
export const refreshAccessToken = async () => {
  const localStorageValue = localStorage.getItem(STORAGE_KEY);
  if (!localStorageValue) return null;

  const response = await basicClient
    .mutation(refreshMutation, {
      refreshToken: JSON.parse(localStorageValue).refreshToken,
    })
    .toPromise();

  if (!response.data) return null;

  const { accessToken, refreshToken } = response.data.refresh;
  const exp = parseJwt(refreshToken).exp;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      accessToken,
      refreshToken,
      exp,
    })
  );

  return {
    accessToken,
  };
};
