import { basicClient } from "../initClient";

const authenticateMutation = `
  mutation($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

/**
 * Use the signature from generateChallenge to get an access token
 * https://docs.lens.xyz/docs/login#authenticate
 */
export const authenticate = async (address: string, signature: string) => {
  const response = await basicClient
    .mutation(authenticateMutation, {
      request: {
        address,
        signature,
      },
    })
    .toPromise();

  console.log(response);

  return response.data.authenticate;
};
