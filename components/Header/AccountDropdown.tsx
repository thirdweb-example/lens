import {
    ChainId,
    MediaRenderer,
    useAddress, useDisconnect, useMetamask,
    useNetwork,
    useNetworkMismatch,
    useSDK, useWalletConnect,
} from "@thirdweb-dev/react";
import useLensUser from "../../util/useLensUser";
import login from "../../util/login";
import Link from "next/link";
import UserAvatar from "../ui/UserAvatar/UserAvatar";

export default function AccountDropdown() {
    const sdk = useSDK();
    const address = useAddress();
    const isWrongNetwork = useNetworkMismatch();
    const connectWithMetamask = useMetamask();
    const connectWithWalletConnect = useWalletConnect();
    const [, switchNetwork] = useNetwork();
    const { isSignedIn, setIsSignedIn, loadingSignIn, profile, loadingProfile } = useLensUser();
    const disconnect = useDisconnect()

    async function signIn() {
        if (!address || !sdk) return;

        if (isWrongNetwork) {
            switchNetwork?.(ChainId.Polygon);
            return;
        }

        await login(address, sdk);
        setIsSignedIn(true);
    }

    // Connect Wallet First
    if (!address) {
        return (
            <div>
                <label htmlFor="wallet-modal" className="btn btn-primary">Login</label>
                <input type="checkbox" id="wallet-modal" className="modal-toggle"/>
                <div className="modal">
                    <div className="modal-box relative">
                        <label htmlFor="wallet-modal" className="btn btn-sm btn-circle absolute right-4 top-4">✕</label>
                        <h3 className="text-xl font-bold">Connect Wallet</h3>
                        <div className="flex py-4 mt-4 gap-2 items-center justify-around">
                            <button className="py-4 px-6 rounded-xl bg-base-200" onClick={connectWithMetamask}>
                                <svg width={100} height={100} className="fill-primary" viewBox="0 0 784.37 1277.39">
                                    <polygon fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                                    <polygon fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
                                    <polygon fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                                    <polygon fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
                                    <polygon fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                                    <polygon fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
                                </svg>
                                <p className="font-semibold mt-2">Browser Wallet</p>
                            </button>
                            <button className="py-4 px-6 rounded-xl bg-base-200" onClick={connectWithWalletConnect}>
                                <svg width={100} height={100} className="fill-primary" viewBox="0 0 300 185" version="1.1">
                                    <path stroke="none" strokeWidth="1" fillRule="nonzero" d="M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z" />
                                </svg>
                                <p className="font-semibold mt-2">Wallet Connect</p>
                            </button>
                        </div>
                    </div>
                </div>
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
            <div>
                {
                    isWrongNetwork ?
                        (
                            <button className="btn btn-error btn-outline" onClick={signIn}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                                <div className="ml-1">
                                    Switch Network
                                </div>
                            </button>
                        ) : (
                            <button className="btn btn-success text-gray-50" onClick={signIn}>
                                <img className="w-5 h-5 mr-1" src="/lens.png" alt="Lens Logo" />
                                Sign In with Lens
                            </button>
                        )
                }
            </div>
    );
    }

    // Loading profile
    if (loadingProfile) {
        return <div>Loading...</div>;
    }

    // Is signed in but doesn't have profile
    if (!profile) {
        return <p>No Lens profile.</p>;
    }

    // Is signed in and has profile
    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <UserAvatar profile={profile} h="h-10" w="w-10" />
            </label>
            <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52">
                <li>
                    <Link href={`/profile/${profile.handle}`} className="flex flex-col items-start gap-0">
                        <div>Logged in as</div>
                        <div className="text-secondary">@{profile.handle}</div>
                    </Link>
                </li>
                <div className="divider mb-1 mt-1"></div>
                <li>
                    <Link href={`/profile/${profile.handle}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        My profile
                    </Link>
                </li>
                <li><a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    Light mode
                </a></li>
                <li><a onClick={disconnect}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Logout
                </a></li>
            </ul>
        </div>
    )
}
