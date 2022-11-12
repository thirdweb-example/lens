import { createClient } from "../initClient";

const unFollowUserMutation = `
mutation($request: UnfollowRequest!) {
  createUnfollowTypedData(request: $request) {
    id
    expiresAt
    typedData {
      types {
        BurnWithSig {
          name
          type
        }
      }
      domain {
        version
        chainId
        name
        verifyingContract
      }
      value {
        nonce
        deadline
        tokenId
      }
    }
  }
}
`;

/**
 * This uses the authenticated urql client (meaning we send the access token with the request)
 * It creates a unfollow signature that we can send to the Lens smart contract to call
 * the burnWithSig function to unfollow a user.
 */
export const unFollowUser = async (profileId: string) => {
  const authenticatedClient = await createClient();

  const response = await authenticatedClient
    .mutation(unFollowUserMutation, {
      request: {
        profile: profileId,
      },
    })
    .toPromise();

  console.log(response)

  return response.data.createUnfollowTypedData;
};
