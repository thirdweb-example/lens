type Publication = {
  __typename: string;
  id: string;
  metadata: {
    name: string;
    description: string;
    content: string;
    image: string | null;
    cover: {
      original: {
        url: string;
      };
    } | null;
    tags: [];
  };
  onChainContentURI: string;
};

export default Publication;
