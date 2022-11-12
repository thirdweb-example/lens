import { basicClient } from "../initClient";
import ProtocolStats from "../../types/ProtocolStats";
import ProfileSeachResult from "../../types/ProfileSeachResult";

const search = `
  query Search($query: Search!, $type: SearchRequestTypes!) {
    search(request: {
      query: $query,
      type: $type,
    }) {
      ... on ProfileSearchResult {
        __typename 
        items {
          ... on Profile {
            ...ProfileFields
          }
        }
        pageInfo {
          prev
          totalCount
          next
        }
      }
    }
  }

  fragment MediaFields on Media {
    url
  }

  fragment ProfileFields on Profile {
    profileId: id,
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    stats {
      totalFollowers
      totalFollowing
    }
  }
`

async function searchProfiles(query: string): Promise<ProfileSeachResult[]> {
    const response = await basicClient.query(search, {
        query,
        type: 'PROFILE'
    }).toPromise();
    console.log(response.data.search.items)
    return response.data.search.items as ProfileSeachResult[];
}

export default searchProfiles;
