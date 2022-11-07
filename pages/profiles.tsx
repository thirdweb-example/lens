import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import searchProfiles from "../graphql/query/searchProfiles";
import Link from "next/link";

export default function Profiles() {
    const router = useRouter()
    const { search } = router.query

    const { data, isLoading } = useQuery(
        ["searchProfiles"],
        () => searchProfiles(search as string)
    );

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!data) {
        return <p>No Result</p>
    }

    return (
        <div className="flex flex-col gap-2">
            {
                data.map((profile, index) => (
                    <Link href={`/profile/${profile.handle}`} style={{ textDecoration: 'none' }} key={index}>
                        <div className="flex p-4 rounded-xl bg-base-200">
                            {profile.profileId}
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
