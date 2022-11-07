import ProfileStats from "./ProfileStats";
import Attribute from "./Attribute";
import Amount from "./Amount";

type ProfileSeachResult = {
    profileId: string;
    name: string;
    bio: string;
    attributes: Attribute[];
    isFollowedByMe: boolean;
    isFollowing: boolean;
    followNftAddress: string | null;
    metadata: string;
    isDefault: boolean;
    handle: string;
    picture: {
        uri: string | null;
        original: {
            url: string;
        };
        __typename: string;
    };
    coverPicture: {
        uri: string | null;
        original: {
            url: string;
        };
        __typename: string;
    };
    ownedBy: string;
    dispatcher: {
        address: string
    };
    stats: ProfileStats;
    followModule: {
        type: string;
        amount: Amount;
        recipient: string;
    };
}

export default ProfileSeachResult
