import Profile from "../../types/Profile";
import { basicClient } from "../initClient";

const exploreProfiles = `
query ExploreProfiles {
  exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
    items {
      id
      name
      bio
      handle
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      stats {
        totalFollowers
      }
    }
  }
}
`;

async function mostFollowedProfiles(): Promise<Profile[]> {
  const response = await basicClient.query(exploreProfiles, {}).toPromise();
  return response.data.exploreProfiles.items as Profile[];
}

export default mostFollowedProfiles;
