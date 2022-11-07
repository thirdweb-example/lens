import { basicClient } from "../initClient";

const doesFollowQuery = `
  query($request: DoesFollowRequest!) {
    doesFollow(request: $request) { 
      followerAddress
      profileId
      follows
    }
  }
`;

/**
 * Load a user's profile by their handle.
 */
async function doesFollowUser(
  followerAddress: string,
  profileId: string
): Promise<boolean> {
  const response = await basicClient
    .query(doesFollowQuery, {
      request: {
        followInfos: [
          {
            followerAddress,
            profileId,
          },
        ],
      },
    })
    .toPromise();

  console.log("hello???", response.data.doesFollow);

  return response.data.doesFollow[0].follows;
}

export default doesFollowUser;
