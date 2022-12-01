import {useQuery} from "@tanstack/react-query";
import exploreProfiles from "../../graphql/query/exploreProfiles";
import {useState} from "react";
import Profile from "../../types/Profile";

export default function LeaderBoard () {
    const [sortCriteria, setSortCriteria] = useState("MOST_FOLLOWERS")
    const { data, isLoading } = useQuery(
        ["profiles", sortCriteria],
        () => exploreProfiles(sortCriteria)
    );

    const handleSortCriteriaChange = (value: string) => {
        setSortCriteria(value)
    }

    return (
        <div className="flex flex-col sm:w-2/3">
            <div className="tabs tabs-boxed my-4 justify-center flex">
                <div
                    className={`tab grow tab-lg ${sortCriteria === 'MOST_FOLLOWERS' ? 'tab-active' : ''}`}
                    onClick={() => handleSortCriteriaChange('MOST_FOLLOWERS')}
                >
                    Followers
                </div>
                <div
                    className={`tab grow tab-lg ${sortCriteria === 'MOST_COLLECTS' ? 'tab-active' : ''}`}
                    onClick={() => handleSortCriteriaChange('MOST_COLLECTS')}
                >
                    Collects
                </div>
                <div
                    className={`tab grow tab-lg ${sortCriteria === 'MOST_POSTS' ? 'tab-active' : ''}`}
                    onClick={() => handleSortCriteriaChange('MOST_POSTS')}
                >
                    Posts
                </div>
            </div>
            {
                isLoading ? (
                    <div>Loading</div>
                ) : (
                    <div className="pb-6 h-3/5 w-full rounded-xl">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Followers</th>
                                <th className="hidden md:table-cell">Posts</th>
                                <th className="hidden md:table-cell">Collects</th>
                                <th className="hidden md:table-cell">Links</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data?.map((profile: Profile, index: number) => (
                                    <tr key={index} className="relative">
                                        <td className='px-2'>
                                            <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
                                                <div>
                                                    {
                                                        profile.picture && profile.picture.original ? (
                                                            <img
                                                                src={profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                                                alt="user profile picture"
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-500" />
                                                        )
                                                    }
                                                </div>
                                                <div className='font-semibold break-words'>
                                                    { profile.name || profile.handle }
                                                </div>
                                            </div>
                                            {
                                                index === 0 && (
                                                    <div
                                                        className='absolute top-1 left-1'
                                                    >
                                                        <span className="badge bg-yellow-400 text-base-100">#1</span>
                                                    </div>
                                                )
                                            }
                                            {
                                                index === 1 && (
                                                    <div
                                                        className='absolute top-1 left-1'
                                                    >
                                                        <span className="badge bg-gray-400 text-base-100">#2</span>
                                                    </div>
                                                )
                                            }
                                            {
                                                index === 2 && (
                                                    <div
                                                        className='absolute top-1 left-1'
                                                    >
                                                        <span className="badge bg-orange-500 text-base-100">#3</span>
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td>{ profile.stats.totalFollowers }</td>
                                        <td className="hidden md:table-cell">{ profile.stats.totalPosts }</td>
                                        <td className="hidden md:table-cell">{ profile.stats.totalCollects }</td>
                                        <td className="hidden md:table-cell">
                                            <div className='flex items-center gap-3'>
                                                <a href={`https://lenster.xyz/u/${profile.handle}`} target='_blank' rel="noreferrer">
                                                    <img
                                                        src='assets/logo-lenster.svg'
                                                        alt='Lenster logo'
                                                        className="w-6 h-6"
                                                    />
                                                </a>
                                                <a href={`https://polygonscan.com/address/${profile.ownedBy}`} target='_blank' rel="noreferrer">
                                                    <img
                                                        src='assets/logo-polygon.svg'
                                                        alt='Polygonscan logo'
                                                        className="w-6 h-6"
                                                    />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    )
}
