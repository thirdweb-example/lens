type Profile = {
  id: string;
  name: string;
  bio: string;
  handle: string;
  picture: {
    original: {
      url: string;
    };
  };
  stats: {
    totalFollowers: 55587;
  };
  __typename: "Profile";
};

export default Profile;
