import { basicClient } from "../initClient";
import ProtocolStats from "../../types/ProtocolStats";

const protocolStats = `
query GlobalProtocolStats {
  globalProtocolStats(request: null) {
    totalProfiles
    totalBurntProfiles
    totalPosts
    totalMirrors
    totalComments
    totalCollects
    totalFollows
    totalRevenue {
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
`;

async function globalProtocolStats(): Promise<ProtocolStats> {
    const response = await basicClient.query(protocolStats, {}).toPromise();
    return response.data.globalProtocolStats as ProtocolStats;
}

export default globalProtocolStats;
