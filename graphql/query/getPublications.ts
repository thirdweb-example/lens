import client from "../initClient";

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

async function getPublications(profileId: string, limit: number): Promise<any> {
  const response = await client
    .query(getPublicationsQuery, {
      id: profileId,
      limit: limit,
    })
    .toPromise();

  console.log(response);

  return response.data.publications.items as any[];
}

export default getPublications;
