import Seo from "../components/SEO/Seo";
import LeaderBoard from "../components/LeaderBoard"
import {APP_NAME} from "../constants";

export default function Index() {
    return (
        <>
            <Seo
                title={`LeaderBoard | ${APP_NAME}`}
                description={`Reward your Lens Protocole followers/Collectors by creating a giveaway`}
            />
            <LeaderBoard />
        </>
    )
}
