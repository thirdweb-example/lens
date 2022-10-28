import { basicClient } from "../initClient";

const authenticateMutation = `
  mutation($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

export const authenticate = async (address: string, signature: string) => {
  const response = await basicClient
    .mutation(authenticateMutation, {
      request: {
        address,
        signature,
      },
    })
    .toPromise();

  return response.data.authenticate;
};
