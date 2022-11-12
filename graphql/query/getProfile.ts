import Profile from "../../types/Profile";
import {basicClient} from "../initClient";

export const getProfileQuery = `
query Profile($handle: Handle!) {
  profile(request: { handle: $handle }) {
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
    stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
  }
}
`;

/**
 * Load a user's profile by their handle.
 */
async function getProfile(handle: string): Promise<Profile> {
    const response = await basicClient
        .query(getProfileQuery, {
            handle,
        })
        .toPromise();
    return response.data.profile as Profile;
}

export default getProfile;
