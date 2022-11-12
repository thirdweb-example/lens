type Profile = {
  id: string;
  name: string;
  bio: string;
  handle: string;
  picture: {
    uri: string | null;
    original: {
      url: string;
    };
    __typename: string;
  };
  coverPicture: null | {
    uri: string | null;
    original: {
      url: string;
    };
    __typename: string;
  };
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    totalPosts: number;
    totalComments: number;
    totalMirrors: number;
    totalPublications: number;
    totalCollects: number;
  };
  ownedBy: string;
  __typename: "Profile";
};

export default Profile;
