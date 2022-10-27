import { useQuery } from "@tanstack/react-query";
import mostFollowedProfiles from "../graphql/query/mostFollowedProfiles";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";

export default function Home() {
  // Queries
  const { data, isLoading } = useQuery(
    ["mostFollowedProfiles"],
    mostFollowedProfiles
  );

  console.log(data);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Image
            src="/thirdweb.svg"
            height={75}
            width={115}
            className={styles.icon}
            alt="thirdweb"
          />
          <Image
            width={75}
            height={75}
            src="/lens.jpeg"
            className={styles.icon}
            alt="sol"
          />
        </div>
        <h1 className={styles.h1}>Lens, meet thirdweb 👋</h1>
        <p className={styles.explain}>
          Build a simple application with thirdweb and Lens Protocol.
        </p>

        <div className={styles.profileGrid}>
          {
            // Display the most followed profiles
            isLoading ? (
              <p>Loading...</p>
            ) : (
              data?.map((profile) => (
                <a
                  href={`/profile/${profile.handle}`}
                  className={styles.profileContainer}
                  key={profile.id}
                >
                  <MediaRenderer
                    src={profile?.picture?.original?.url || ""}
                    style={{
                      borderRadius: "50%",
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                    }}
                  />
                  <h2 className={styles.profileName}>{profile.name}</h2>
                  <p className={styles.profileBio}>@{profile.handle}</p>
                </a>
              ))
            )
          }
        </div>
      </div>
    </>
  );
}
