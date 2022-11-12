import Seo from "../components/SEO/Seo";
import Giveaway from "../components/Giveaway"
import {APP_NAME} from "../constants";

export default function Index() {
    return (
        <>
            <Seo
                title={`Giveway | ${APP_NAME}`}
                description={`Reward your Lens Protocole followers/Collectors by creating a giveaway`}
            />
            <Giveaway />
        </>
    )
}
