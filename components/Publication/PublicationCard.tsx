import { MediaRenderer } from "@thirdweb-dev/react";
import Publication from "../../types/Publication";
import styles from "./Publication.module.css";

type Props = {
  publication: Publication;
};

export default function PublicationCard({ publication }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{publication.metadata.name}</h2>
        <p className={styles.content}>{publication.metadata.content}</p>
      </div>
      {publication.metadata.image && (
        <MediaRenderer
          src={publication.metadata.image || ""}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 16,
          }}
          alt={publication.metadata.name}
        />
      )}
    </div>
  );
}
