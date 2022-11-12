import Profile from "../../types/Profile";
import { basicClient } from "../initClient";

export const getProfileQuery = `
query Profile($address: EthereumAddress!) {
  defaultProfile(request: { ethereumAddress: $address }) {
    id
    name
    bio
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    ownedBy
    handle
  }
}
`;

/**
 * Get a Lens Profile using a wallet address
 * Returns null if the user does not have a profile
 */
async function getProfileByAddress(address: string): Promise<Profile | null> {
  const response = await basicClient
    .query(getProfileQuery, {
      address,
    })
    .toPromise();

  console.log("default profile", response.data)

  return response.data.defaultProfile as Profile | null;
}

export default getProfileByAddress;
