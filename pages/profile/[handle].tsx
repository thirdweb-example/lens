import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import {
  MediaRenderer,
  useAddress,
  useSDK,
  useSigner,
} from "@thirdweb-dev/react";
import getProfile from "../../graphql/query/getProfile";
import styles from "../../styles/Profile.module.css";
import getPublications from "../../graphql/query/getPublications";
import PublicationCard from "../../components/Publication/PublicationCard";
import Publication from "../../types/Publication";
import useLensUser from "../../util/useLensUser";
import login from "../../util/login";
import { followUser } from "../../graphql/mutate/followUser";
import { LENS_HUB_CONTRACT_ADDRESS } from "../../graphql/initClient";
import { LENS_PROTOCOL_PROFILES_ABI } from "../../const/abis";
import { signedTypeData, splitSignature } from "../../util/ethers.service";

export default function ProfilePage() {
  const router = useRouter();
  const { handle } = router.query;
  const address = useAddress();
  const sdk = useSDK();
  const signer = useSigner();
  const { isSignedIn } = useLensUser();

  // Load the same queries we did on the server-side.
  // Will load data instantly since it's already in the cache.
  const { data: profile, isLoading: loadingProfile } = useQuery(
    ["profile"],
    () => getProfile(handle as string)
  );

  // When the profile is loaded, load the publications
  const { data: publications, isLoading: loadingPublications } = useQuery(
    ["publications"],
    () => getPublications(profile?.id as string, 10),
    {
      enabled: !!profile,
    }
  );

  async function followThisUser(id: string) {
    if (!isSignedIn) {
      if (address && sdk) await login(address, sdk);
    }

    const result = await followUser(id as string);

    console.log("follow: result", result);

    const typedData = result.typedData;
    console.log("follow: typedData", typedData);

    const signature = await signedTypeData(
      signer,
      typedData.domain,
      typedData.types,
      typedData.value
    );
    console.log("follow: signature", signature);

    const { v, r, s } = splitSignature(signature);

    const lensHubContract = await sdk?.getContractFromAbi(
      LENS_HUB_CONTRACT_ADDRESS,
      LENS_PROTOCOL_PROFILES_ABI
    );

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

      console.log("follow: tx", tx);
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

        <button
          onClick={() => followThisUser(profile.id)}
          className={styles.followButton}
        >
          Follow
        </button>

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
