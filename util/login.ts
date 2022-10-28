import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { generateChallenge } from "../graphql/auth/generateChallenge";
import { authenticate } from "../graphql/auth/getAccessToken";
import { STORAGE_KEY } from "../graphql/initClient";
import parseJwt from "./parseJwt";

/**
 * Function that signs the user into Lens by generating a challenge and signing it with their wallet.
 */
export default async function login(address: string, sdk: ThirdwebSDK) {
  if (!address || !sdk) return;

  try {
    // Generate Auth Challenge
    const challenge = await generateChallenge(address);

    // Sign the challenge message
    const signature = await sdk.wallet.sign(challenge);

    // Send the signature to the API to get an access token + refresh token
    const { accessToken, refreshToken } = await authenticate(
      address,
      signature
    );

    // Now let's store the authentication information in local storage
    const accessTokenData = parseJwt(accessToken);
    localStorage.setItem(
      STORAGE_KEY, // This is the key we use to store the authentication information in local storage
      JSON.stringify({
        accessToken,
        refreshToken,
        exp: accessTokenData.exp,
      })
    );

    return address;
  } catch (error) {
    console.error(error);
    alert("Error signing in");
  }
}
