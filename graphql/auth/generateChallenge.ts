import { basicClient } from "../initClient";

const getChallengeQuery = `
    query($request: ChallengeRequest!) {
        challenge(request: $request) { text }
    }
`;

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
