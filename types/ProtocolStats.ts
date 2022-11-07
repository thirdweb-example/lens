type ProtocolStats = {
    totalProfiles: number,
    totalBurntProfiles: number,
    totalPosts: number,
    totalMirrors: number,
    totalComments: number,
    totalCollects: number,
    totalFollows: number,
    totalRevenue: [
        {
            asset: {
                name: string,
                symbol: string,
                decimals: number,
                address: string
            }
            value: string
        }
    ],
    __typename: "GlobalProtocolStats"
}

export default ProtocolStats
