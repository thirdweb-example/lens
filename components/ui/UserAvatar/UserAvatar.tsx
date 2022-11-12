import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import Profile from "../../../types/Profile";
import ProfileSeachResult from "../../../types/ProfileSeachResult";
import {MediaRenderer} from "@thirdweb-dev/react";

type Props = {
    profile: Profile | ProfileSeachResult
    h: string
    w: string
}

export default function UserAvatar({ profile, h, w }: Props) {
    if (!profile.picture) {
        return (
            <Image width={30} height={30} className={`${h} ${w} rounded-full`} src={makeBlockie(profile.ownedBy)} alt={profile.name} />
        )
    }

    if (profile.picture.__typename === 'MediaSet') {
        return (
            <MediaRenderer
                className={`${h} ${w} rounded-full bg-base-100`}
                src={profile.picture.original.url || ""}
                style={{objectFit: 'cover'}}
            />
        )
    } else {
        return (
            <MediaRenderer
                src={profile.picture.uri || ""}
                className={`${h} ${w} mask mask-hexagon`}
            />
        )
    }
}


