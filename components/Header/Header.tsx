import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeNavigator}>
        <img src="/lens.jpeg" alt="Lens Logo" className={styles.logo} />
        <h1 className={styles.logoText}>Lens Starter Kit</h1>
      </Link>
    </div>
  );
}
