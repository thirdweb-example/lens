import {
  ChainId,
  ConnectWallet,
  useAddress,
  useNetwork,
  useNetworkMismatch,
  useSDK,
} from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "./Header.module.css";
import useLensUser from "../../util/useLensUser";
import login from "../../util/login";

export default function Header() {
  const sdk = useSDK();
  const address = useAddress();
  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { isSignedIn, setIsSignedIn, loadingSignIn, profile, loadingProfile } =
    useLensUser();

  async function signIn() {
    if (!address || !sdk) return;

    if (isWrongNetwork) {
      switchNetwork?.(ChainId.Polygon);
      return;
    }

    await login(address, sdk);
    setIsSignedIn(true);
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeNavigator}>
        <img src="/lens.jpeg" alt="Lens Logo" className={styles.logo} />
        <h1 className={styles.logoText}>Lens Starter Kit</h1>
      </Link>

      <RightSide />
    </div>
  );

  // Separate component for what to show on right side
  function RightSide() {
    // Connect Wallet First
    if (!address) {
      return (
        <div style={{ marginRight: 12 }}>
          <ConnectWallet accentColor="#f213a4" />
        </div>
      );
    }

    // Loading sign in state
    if (loadingSignIn) {
      return <div>Loading...</div>;
    }

    // Not signed in
    if (!isSignedIn) {
      return (
        <button className={styles.signInButton} onClick={signIn}>
          {isWrongNetwork ? "Switch Network" : "Sign In with Lens"}
        </button>
      );
    }

    // Loading profile
    if (loadingProfile) {
      return <div>Loading...</div>;
    }

    // Is signed in but doesn't have profile
    if (!profile) {
      return <p className={styles.profileName}>No Lens profile.</p>;
    }

    // Is signed in and has profile
    return <p className={styles.profileName}>@{profile.handle} </p>;
  }
}
