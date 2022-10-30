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
  Web3Button,
} from "@thirdweb-dev/react";
import getProfile from "../../graphql/query/getProfile";
import getPublications from "../../graphql/query/getPublications";
import PublicationCard from "../../components/Publication/PublicationCard";
import Publication from "../../types/Publication";
import useLensUser from "../../util/useLensUser";
import login from "../../util/login";
import { followUser } from "../../graphql/mutate/followUser";
import { LENS_HUB_CONTRACT_ADDRESS } from "../../graphql/initClient";
import { LENS_PROTOCOL_PROFILES_ABI } from "../../const/abis";
import { signedTypeData, splitSignature } from "../../util/ethers.service";
import styles from "../../styles/Profile.module.css";
import doesFollowUser from "../../graphql/query/doesFollowUser";

/**
 * Dynamic route to display a Lens profile and their publications given a handle
 */
export default function ProfilePage() {
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
    () => getPublications(profile?.id as string, 10),
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

  const { mutateAsync: follow } = useMutation(() => followThisUser(), {
    // When the mutation is successful, invalidate the doesFollow query so it will re-run
    onSuccess: () => {
      queryClient.setQueryData(["follows", address, profile?.id], true);
    },
  });

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

  if (loadingProfile) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileOutlineContainer}>
        <MediaRenderer
          src={profile.picture.original.url || ""}
          style={{
            borderRadius: "50%",
            width: "128px",
            height: "128px",
            objectFit: "cover",
          }}
        />
        <h1 className={styles.profileName}>{profile?.name}</h1>
        <p className={styles.profileHandle}>@{profile?.handle}</p>

        {doesFollow ? (
          <b className={styles.following}>Following</b>
        ) : (
          <Web3Button
            contractAddress={LENS_HUB_CONTRACT_ADDRESS}
            contractAbi={LENS_PROTOCOL_PROFILES_ABI}
            colorMode="dark"
            accentColor="#f213a4"
            action={() => follow()}
            className={styles.followButton}
          >
            Follow
          </Web3Button>
        )}

        <p className={styles.profileBio}>{profile.bio}</p>
      </div>

      {loadingPublications ? (
        <p>Loading publications...</p>
      ) : (
        <div className={styles.publicationsContainer}>
          {publications?.map((publication: Publication) => (
            <PublicationCard publication={publication} key={publication.id} />
          ))}
        </div>
      )}
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
