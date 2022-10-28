import { useQuery } from "@tanstack/react-query";
import mostFollowedProfiles from "../graphql/query/mostFollowedProfiles";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";

export default function Home() {
  // Load the top 25 most followed Lens profiles
  const { data, isLoading } = useQuery(
    ["mostFollowedProfiles"],
    mostFollowedProfiles
  );

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
        <h1 className={styles.h1}>Lens Starter Kit</h1>
        <p className={styles.explain}>
          Build a simple application using thirdweb and Lens!
        </p>

        <div className={styles.profileGrid}>
          {isLoading ? (
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
                <p className={styles.profileHandle}>@{profile.handle}</p>
              </a>
            ))
          )}
        </div>
      </div>
    </>
  );
}
