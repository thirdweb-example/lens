import {CURRENCIES} from '../../constants'
import useLensUser from '../../util/useLensUser'
import {useQuery} from '@tanstack/react-query'
import getPublications from '../../graphql/query/getPublications'
import {useEffect, useState} from "react";
import {getStats} from "../../graphql/query/getStats";
import Profile from "../../types/Profile";
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";
import ModuleSelector from "./ModuleSelector";
import BestModule from "./Form/BestModule";

export default function Giveaway() {
    const [bestCollector, setBestCollector] = useState<{ profile: Profile, amount: number } | null>()
    const [bestCommentator, setBestCommentator] = useState<{ profile: Profile, amount: number } | null>()
    const [selected, setSelected] = useState<{ id: number, name: string } | null>();
    const {profile, isSignedIn } = useLensUser()
    const address = useAddress();

    const { data: publications } = useQuery(
        ["publications"],
        () => getPublications(profile?.id as string),
        {
            // Only run this query if the profile is loaded
            enabled: !!profile,
        }
    )

    useEffect(() => {
        getStats(publications).then((response) => {
            if (response) {
                setBestCollector(response.bestCollector)
                setBestCommentator(response.bestCommentator)
            }
        })
    }, [publications])

    function handleSelected(item: any) {
        setSelected(item)
    }

    if (!address || !isSignedIn) {
        return (
            <div>You need to login first</div>
        )
    }

    if (!profile) {
        return <p>No Lens profile.</p>;
    }


    return (
        <div className="hero h-[80vh] bg-base-200">
            <div className="hero-content flex-col w-full lg:flex-row justify-between">
                <div>
                    <h1 className="text-5xl font-bold">Community Giveaway!</h1>
                    <p className="py-6">Select a giveaway module to reward your community</p>
                    {
                        bestCollector && bestCommentator ? (
                            <ModuleSelector onSelect={handleSelected} selected={selected} />
                        ) : (
                            <progress className="progress w-56"></progress>
                        )
                    }
                </div>
                <div className="flex flex-col gap-4">
                    {
                        selected?.id === 1 && bestCollector && (
                            <div className="py-4 px-2 rounded-xl bg-base-300">
                                <div className="flex flex-col items-center">
                                    {
                                        bestCollector.profile.picture && bestCollector.profile.picture.original ? (
                                            <MediaRenderer
                                                src={bestCollector.profile.picture.original.url}
                                                alt="user profile picture"
                                                className="rounded-full object-cover w-12 h-12"
                                            />
                                        ) : (
                                            <div className="bg-base-300 w-12 h-12 rounded-full"></div>
                                        )
                                    }
                                </div>
                                <div className="font-semibold text-center">{ bestCollector.profile.name }</div>
                            </div>
                        )
                    }
                    {
                        selected?.id === 2 && bestCommentator && (
                            <div className="py-4 px-2 rounded-xl bg-base-300">
                                <div className="flex flex-col items-center">
                                    {
                                        bestCommentator.profile.picture && bestCommentator.profile.picture.original ? (
                                            <MediaRenderer
                                                src={bestCommentator.profile.picture.original.url}
                                                alt="user profile picture"
                                                className="rounded-full object-cover w-12 h-12"
                                            />
                                        ) : (
                                            <div className="bg-base-300 w-12 h-12 rounded-full"></div>
                                        )
                                    }
                                </div>
                                <div className="font-semibold text-center">{ bestCommentator.profile.name }</div>
                            </div>
                        )
                    }
                    {(() => {
                        if (selected) {
                            switch (selected.id) {
                                case 1:
                                    if (bestCollector) {
                                        return <BestModule
                                            label={selected.name}
                                            winner={bestCollector.profile}
                                            address={address}
                                            currencies={CURRENCIES}
                                        />
                                    }
                                    break;
                                case 2:
                                    if (bestCommentator) {
                                        return <BestModule
                                            label={selected.name}
                                            winner={bestCommentator.profile}
                                            address={address}
                                            currencies={CURRENCIES}
                                        />
                                    }
                                    break;
                                default:
                                    return <div className="text-gray-500">Comming Soon</div>
                            }
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}
