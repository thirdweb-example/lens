import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useSDK,
  useSigner,
} from "@thirdweb-dev/react";
import getProfile from "../../graphql/query/getProfile";
import getPublications from "../../graphql/query/getPublications";
import getProfileFollowRevenue from "../../graphql/query/getProfileFollowRevenue";
import useLensUser from "../../util/useLensUser";
import login from "../../util/login";
import { followUser } from "../../graphql/mutate/followUser";
import { LENS_HUB_CONTRACT_ADDRESS } from "../../graphql/initClient";
import { LENS_PROTOCOL_PROFILES_ABI, LENS_FOLLOW_NFT_CONTRACT_ABI } from "../../const/abis";
import { signedTypeData, splitSignature } from "../../util/ethers.service";
import doesFollowUser from "../../graphql/query/doesFollowUser";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import {unFollowUser} from "../../graphql/mutate/unFollowUser";
import {useEffect, useState} from "react";
import {getStats} from "../../graphql/query/getStats";
import TopUserCard from "../../components/ui/TopUserCard/TopUserCard";
import Profile from "../../types/Profile";
import LoadingTopUserCard from "../../components/ui/TopUserCard/LoadingTopUserCard";
import getProfilePublicationRevenue from "../../graphql/query/getProfilePublicationsRevenue";
import {baseRevenue} from "../../util/revenue";

/**
 * Dynamic route to display a Lens profile and their publications given a handle
 */
export default function ProfilePage() {
  const [bestCollector, setBestCollector] = useState<{ profile: Profile, amount: number } | null>()
  const [bestCommentator, setBestCommentator] = useState<{ profile: Profile, amount: number } | null>()
  const [profileRevenue, setProfileRevenue] = useState()
  const [followRevenue, setFollowRevenue] = useState()
  // Next.js Router: Load the user's handle from the URL
  const router = useRouter();
  const { handle } = router.query;

  // Get the SDK and signer for us to use for interacting with the lens smart contract
  const sdk = useSDK();
  const signer = useSigner();

  // React Query
  const queryClient = useQueryClient();

  // Get the currently connected wallet address
  const address = useAddress();

  // See if we need to sign the user in before they try follow a user
  const { isSignedIn } = useLensUser();

  // Load the same queries we did on the server-side.
  // Will load data instantly since it's already in the cache.
  const { data: profile, isLoading: loadingProfile } = useQuery(
    ["profile"],
    () => getProfile(handle as string)
  );

  // When the profile is loaded, load the publications for that profile
  const { data: publications, isLoading: loadingPublications } = useQuery(
    ["publications"],
    () => getPublications(profile?.id as string),
    {
      // Only run this query if the profile is loaded
      enabled: !!profile,
    }
  );

  // Check to see if the connected wallet address follows this user
  const { data: doesFollow } = useQuery(
    ["follows", address, profile?.id],
    () => doesFollowUser(address as string, profile?.id as string),
    {
      // Only run this query if the profile is loaded
      enabled: !!profile && !!address,
    }
  );

  // Connect to the Lens Hub smart contract using it's ABI and address
  const { contract: lensHubContract } = useContract(
    LENS_HUB_CONTRACT_ADDRESS,
    LENS_PROTOCOL_PROFILES_ABI
  );

  const { contract: followContract } = useContract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENS_FOLLOW_NFT_CONTRACT_ABI
  )

  const { mutateAsync: follow } = useMutation(() => followThisUser(), {
    // When the mutation is successful, invalidate the doesFollow query so it will re-run
    onSuccess: () => {
      queryClient.setQueryData(["follows", address, profile?.id], true);
    },
  });

  const { mutateAsync: unfollow } = useMutation(() => unFollowThisUser(), {
    // When the mutation is successful, invalidate the doesFollow query so it will re-run
    onSuccess: () => {
      queryClient.setQueryData(["unfollow", address, profile?.id], true);
    },
  });

  useEffect(() => {
    getStats(publications).then((response) => {
      if (response) {
        setBestCollector(response.bestCollector)
        setBestCommentator(response.bestCommentator)
      }
    })
  }, [publications])

  useEffect(() => {
    if (profile) {
      getProfileRevenue(profile).then(() => {})
      getFollowReveue(profile).then(() => {})
    }
  }, [profile])

  async function getProfileRevenue(profile: Profile) {
    let revenue = JSON.parse(JSON.stringify(baseRevenue))
    const response = await getProfilePublicationRevenue(profile.id)
    for (let i = 0; i < response.length; i++) {
      revenue[response[i].revenue.total.asset.symbol].total += parseInt(response[i].revenue.total.value)
    }
    setProfileRevenue(revenue)
  }

  async function getFollowReveue(profile: Profile) {
    let revenue = JSON.parse(JSON.stringify(baseRevenue))
    const response = await getProfileFollowRevenue(profile.id)
    for (let i = 0; i < response.length; i++) {
      revenue[response[i].total.asset.symbol].total += parseInt(response[i].total.value)
    }
    setFollowRevenue(revenue)
  }

  // Follow the user when the follow button is clicked
  // This function does the following:
  // 1. Runs the followUser GraphQL Mutation to generate a typedData object
  // 2. Signs the typedData object with the user's wallet
  // 3. Sends the signature to the smart contract to follow the user,
  // by calling the "followWithSig" function on the LensHub contract
  async function followThisUser() {
    if (!isSignedIn) {
      if (address && sdk) await login(address, sdk);
    }

    if (!profile || !signer) return;

    // 1. Runs the followUser GraphQL Mutation to generate a typedData object
    const result = await followUser(profile.id);
    const typedData = result.typedData;

    // 2. Signs the typedData object with the user's wallet
    const signature = await signedTypeData(
      signer,
      typedData.domain,
      typedData.types,
      typedData.value
    );

    // 3. Sends the signature to the smart contract to follow the user,
    const { v, r, s } = splitSignature(signature);

    try {
      const tx = await lensHubContract?.call("followWithSig", {
        follower: address!,
        profileIds: typedData.value.profileIds,
        datas: typedData.value.datas,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });

      console.log("Followed user", tx);

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  // Unfollow the user when the unfollow button is clicked
  // This function does the following:
  // 1. Runs the unFollowUser GraphQL Mutation to generate a typedData object
  // 2. Signs the typedData object with the user's wallet
  // 3. Sends the signature to the smart contract to follow the user,
  // by calling the "followWithSig" function on the LensHub contract
  async function unFollowThisUser() {
    if (!isSignedIn) {
      if (address && sdk) await login(address, sdk);
    }

    if (!profile || !signer) return;

    // 1. Runs the unFollowUser GraphQL Mutation to generate a typedData object
    const result = await unFollowUser(profile.id);
    const typedData = result.typedData;

    // 2. Signs the typedData object with the user's wallet
    const signature = await signedTypeData(
        signer,
        typedData.domain,
        typedData.types,
        typedData.value
    );

    // 3. Sends the signature to the smart contract to follow the user,
    const { v, r, s } = splitSignature(signature);

    try {
      const sig = {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      };

      // TODO : why do I need this ?
      followContract?.interceptor.overrideNextTransaction(() => ({
        gasLimit: 3000000
      }))
      const tx = await followContract?.call("burnWithSig", typedData.value.tokenId, sig)

      console.log("Unfollow user", tx);

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  if (loadingProfile) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <div className="w-full">
      {
        profile.coverPicture ? (
            <MediaRenderer
                src={profile.coverPicture.original.url}
                style={{objectFit: "cover"}}
                className="w-full h-72"
            />
        ) : (
            <div className="w-full h-64 bg-gray-600"></div>
        )
      }
      <div className="flex flex-col md:flex-row text-center items-center md:items-start bg-base-300 md:gap-6">
        {
          profile.picture ? (
              <>
                {
                  profile.picture.__typename === 'MediaSet' ? (
                      <MediaRenderer
                          src={profile.picture.original.url || ""}
                          style={{objectFit: "cover"}}
                          className="w-28 h-28 -mt-12 rounded-md shadow-xl md:ml-20 md:w-56 md:h-56"
                      />
                  ) : (
                      <MediaRenderer
                          src={profile.picture.uri || ""}
                          className={`w-28 h-28 -mt-12 mask mask-hexagon md:ml-20 md:w-56 md:h-56`}
                      />
                  )
                }
              </>
          ) : (
              <Image width={50} height={50} className={`w-28 h-28 -mt-12 rounded-full`} src={makeBlockie(profile.ownedBy)} alt={profile.name} />
          )
        }
        <div className="flex flex-col md:flex-row my-4 w-full px-4 md:pr-4 md:px-0 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-base-content md:text-left">{profile?.name}</h1>
            <p className="text-secondary md:text-left">@{profile?.handle}</p>
            <p className="text-sm text-base-content/80 md:text-left mb-6">{profile.bio}</p>

            <div className="mb-6">
              <div className="flex justify-center text-center md:justify-start md:text-left gap-4">
                <div>
                  <div className="text-md font-semibold">
                    { profile.stats.totalFollowers }
                  </div>
                  <div className="text-base-content/50">
                    Followers
                  </div>
                </div>
                <div>
                  <div className="text-md font-semibold">
                    { profile.stats.totalFollowing }
                  </div>
                  <div className="text-base-content/50">
                    Following
                  </div>
                </div>
                <div>
                  <div className="text-md font-semibold">
                    { profile.stats.totalPublications }
                  </div>
                  <div className="text-base-content/50">
                    Publications
                  </div>
                </div>
              </div>
            </div>
          </div>

          {doesFollow ? (
              <button className="btn btn-error btn-outline" onClick={() => unfollow()}>Unfollow</button>
          ) : (
              <button
                  className="btn btn-success"
                  onClick={() => follow()}
              >
                Follow
              </button>
          )}
        </div>
      </div>
      <div className="mx-4 my-4">
        <div className="stats w-full stats-vertical sm:stats-horizontal md:shadow md:bg-base-200">

          <div className="stat">
            <div className="stat-title">Posts</div>
            <div className="stat-value">{ profile.stats.totalPosts }</div>
          </div>

          <div className="stat">
            <div className="stat-title">Collects</div>
            <div className="stat-value">{ profile.stats.totalCollects }</div>
          </div>

          <div className="stat">
            <div className="stat-title">Comments</div>
            <div className="stat-value">{ profile.stats.totalComments }</div>
          </div>

          <div className="stat">
            <div className="stat-title">Mirrors</div>
            <div className="stat-value">{ profile.stats.totalMirrors }</div>
          </div>

        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-4">
        {
          bestCollector ? (
                <TopUserCard profile={bestCollector.profile} title="Top collector" label="Post Collected" amount={bestCollector.amount} />
            ) : (
              <LoadingTopUserCard title="Top Collector" />
          )
        }
        {
            bestCommentator ? (
                <TopUserCard profile={bestCommentator.profile} title="Top Commentator" label="Post Commented" amount={bestCommentator.amount} />
            ) : (
                <LoadingTopUserCard title="Top Commentator" />
            )
        }
        <div className="bg-base-200 px-4 py-4 rounded-xl">
          <table className="table w-full h-full">
            <tbody>
            {
                profileRevenue && Object.values(profileRevenue).map((item: any, index) => (
                    <tr key={index}>
                      <th className="">
                        <Image
                            src={`/assets/${item.asset.symbol.toLowerCase()}.svg`}
                            alt="asset token image"
                            width={25}
                            height={25}
                        />
                      </th>
                      <td className="text-right ">{ item.total } { item.asset.symbol }</td>
                    </tr>
                ))
            }
            </tbody>
          </table>
        </div>
        <div className="bg-base-200 px-4 py-4 rounded-xl">
          <table className="table w-full h-full">
            <tbody>
            {
                followRevenue && Object.values(followRevenue).map((item: any, index) => (
                    <tr key={index}>
                      <th className="">
                        <Image
                            src={`/assets/${item.asset.symbol.toLowerCase()}.svg`}
                            alt="asset token image"
                            width={25}
                            height={25}
                        />
                      </th>
                      <td className="text-right ">{ item.total } { item.asset.symbol }</td>
                    </tr>
                ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  // Load data for the profile page on the server-side
  const { handle } = context.params!;
  const queryClient = new QueryClient();

  // "Pre-fetch" the data for the profile page. Meaning when
  // we use the useQuery it is already available in the cache
  await queryClient.prefetchQuery(["profile"], () =>
    getProfile(handle as string)
  );

  // Learn more here: https://tanstack.com/query/v4/docs/guides/ssr#using-hydration
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Returning an empty array here means we
    // don't statically generate any paths at build time, which
    // is probably not the most optimal thing we could do.
    // You could change this behaviour to pre-render any profiles you want
    paths: [],
    fallback: "blocking",
  };
};
