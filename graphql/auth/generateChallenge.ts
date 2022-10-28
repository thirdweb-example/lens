import { basicClient } from "../initClient";

const getChallengeQuery = `
    query($request: ChallengeRequest!) {
        challenge(request: $request) { text }
    }
`;

/**
 * Generate a message the user can sign to sign in with Lens
 * https://docs.lens.xyz/docs/login#challenge
 */
export const generateChallenge = async (address: string) => {
  const response = await basicClient
    .query(getChallengeQuery, {
      request: {
        address,
      },
    })
    .toPromise();

  return response.data.challenge.text;
};
