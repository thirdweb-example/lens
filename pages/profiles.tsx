import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import searchProfiles from "../graphql/query/searchProfiles";
import Link from "next/link";
import UserAvatar from "../components/ui/UserAvatar/UserAvatar";
import Seo from "../components/SEO/Seo";
import {APP_NAME} from "../constants";

export default function Profiles() {
    const router = useRouter()
    const { search } = router.query

    const { data, isLoading } = useQuery(
        ["searchProfiles", search],
        () => searchProfiles(search as string)
    );

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!data) {
        return <p>No Result</p>
    }

    return (
        <>
            <Seo
                title={`Profiles | ${APP_NAME}`}
            />
            <div className="flex flex-col space-y-3 w-1/2">
                {
                    data.map((profile, index) => (
                        <Link href={`/profile/${profile.handle}`} style={{ textDecoration: 'none' }} key={index}>
                            <div className="flex h-28 items-center p-4 rounded-xl bg-base-200 gap-6 hover:shadow">
                                <UserAvatar profile={profile} h="h-16" w="w-16" />
                                <div className="flex flex-col">
                                    <div className="text-xl text-base-content font-semibold">
                                        {profile.name || profile.handle}
                                    </div>
                                    <div className="text-md text-secondary">
                                        @{profile.handle}
                                    </div>
                                    <div className="text-sm text-base-content/80">
                                        {profile.bio}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}
