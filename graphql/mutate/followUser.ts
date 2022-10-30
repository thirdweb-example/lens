import { createClient } from "../initClient";

const followUserMutation = `
mutation($request: FollowRequest!) { 
  createFollowTypedData(request: $request) {
    id
    expiresAt
    typedData {
      domain {
        name
        chainId
        version
        verifyingContract
      }
      types {
        FollowWithSig {
          name
          type
        }
      }
      value {
        nonce
        deadline
        profileIds
        datas
      }
    }
  }
}
`;

/**
 * This uses the authenticated urql client (meaning we send the access token with the request)
 * It creates a follow signature that we can send to the Lens smart contract to call
 * the followWithSig function to follow a user.
 */
export const followUser = async (profileId: string) => {
  const authenticatedClient = await createClient();

  const response = await authenticatedClient
    .mutation(followUserMutation, {
      request: {
        follow: [
          {
            profile: profileId,
          },
        ],
      },
    })
    .toPromise();

  return response.data.createFollowTypedData;
};
