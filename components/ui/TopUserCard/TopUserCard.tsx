import Profile from "../../../types/Profile";
import UserAvatar from "../UserAvatar/UserAvatar";
import Link from "next/link";

type Props = {
    profile: Profile,
    title: string,
    label: string,
    amount: number
}

export default function TopUserCard({ profile, title, label, amount }: Props) {
    return (
        <div className="bg-base-200 rounded-xl h-96">
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="mt-4">
                        <UserAvatar profile={profile} h="h-32" w="w-32" />
                    </div>
                    <div className="text-2xl font-semibold">
                        { title }
                    </div>
                    <div className="text-secondary">@{ profile.name || profile.handle }</div>
                    <div className="badge badge-outline badge-accent">{ amount } { label }</div>
                </div>
                <div className="flex flex-col w-full mb-4 gap-4">
                    <div className="flex items-center justify-around">
                        <div>
                            <div className="text-md font-semibold">{profile.stats.totalFollowers}</div>
                            <div className="text-base-content/50">Followers</div>
                        </div>
                        <div>
                            <div className="text-md font-semibold">{profile.stats.totalFollowing}</div>
                            <div className="text-base-content/50">Following</div>
                        </div>
                    </div>
                    <a className="btn btn-outline btn-accent mx-4" href={`/profile/${profile.handle}`}>
                        See
                    </a>
                </div>
            </div>
        </div>
    )
}
