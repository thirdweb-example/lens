import { basicClient } from "../initClient";

export const getPublicationsQuery = `
  query Publications($id: ProfileId!, $limit: LimitScalar) {
    publications(request: {
      profileId: $id,
      publicationTypes: [POST],
      limit: $limit
    }) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  fragment PostFields on Post {
    id
    metadata {
      ...MetadataOutputFields
    }
    onChainContentURI
  }
  fragment MetadataOutputFields on MetadataOutput {
    name,
    description,
    content,
    image,
    cover {
      original {
        url
      }
    },
    tags,
  }
`;

/**
 * Load a user's publications by their profile id.
 */
async function getPublications(profileId: string, limit: number): Promise<any> {
  const response = await basicClient
    .query(getPublicationsQuery, {
      id: profileId,
      limit: limit,
    })
    .toPromise();

  return response.data.publications.items as any[];
}

export default getPublications;
