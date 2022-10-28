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
