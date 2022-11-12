import Revenue from "../../types/Revenue";
import {basicClient} from "../initClient";


export const profileFollowRevenueQuery = `
query($request: ProfileFollowRevenueQueryRequest!) {
  profileFollowRevenue(request: $request) {
   revenues {
        total {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
      }
   }
}
`

async function getProfileFollowRevenue(profileId: string): Promise<any> {
    const response = await basicClient.query(profileFollowRevenueQuery, {
        request: {
            profileId
        }
    }).toPromise()

    return response.data.profileFollowRevenue.revenues
}

export default getProfileFollowRevenue;
