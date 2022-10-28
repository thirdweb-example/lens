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

  console.log("followed user", response);

  return response.data.createFollowTypedData;
};
