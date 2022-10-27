import Profile from "../../types/Profile";
import client from "../initClient";

export const getProfileQuery = `
query Profile($handle: Handle!) {
  profile(request: { handle: $handle }) {
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

async function getProfile(handle: string): Promise<Profile> {
  const response = await client
    .query(getProfileQuery, {
      handle,
    })
    .toPromise();
  return response.data.profile as Profile;
}

export default getProfile;
