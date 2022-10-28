import Profile from "../../types/Profile";
import { basicClient } from "../initClient";

export const getProfileQuery = `
query Profile($address: EthereumAddress!) {
  defaultProfile(request: { ethereumAddress: $address }) {
    id
    name
    bio
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
    }
    handle
  }
}
`;

/**
 * Get a Lens Profile using a wallet address
 * @param address: Wallet address
 * @returns Profile or null if user doesn't have a lens profile
 */
async function getProfileByAddress(address: string): Promise<Profile | null> {
  const response = await basicClient
    .query(getProfileQuery, {
      address,
    })
    .toPromise();

  return response.data.defaultProfile as Profile | null;
}

export default getProfileByAddress;
