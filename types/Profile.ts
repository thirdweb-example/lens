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
  stats: {
    totalFollowers: number;
  };
  __typename: "Profile";
};

export default Profile;
