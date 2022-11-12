import Publication from "../../types/Publication";
import {basicClient} from "../initClient";
import {getPublicationsQuery} from "./getPublications";

export const whoCollectedPublicationQuery = `
query WhoCollectedPublication($request: WhoCollectedPublicationRequest!) {
  whoCollectedPublication(request: $request) {
    items {
      address
      defaultProfile {
        id
        name
        bio
        isDefault
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            contractAddress
            amount {
              asset {
                name
                symbol
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
           type
          }
          ... on RevertFollowModuleSettings {
           type
          }
        }
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`

export async function getStats(pubs: Publication[]) {
    try {
        let collectors: any = {}
        let comments: any = {}
        let bestCollector: any = {}
        let bestCommentator: any = {}
        for (const publication of pubs) {
            const collectorResponse = await basicClient.query(whoCollectedPublicationQuery, {
                request: { publicationId: publication.id }
            }).toPromise()
            const items = collectorResponse.data.whoCollectedPublication.items
            for (let i = 0; i < items.length; i++){
                collectors[items[i].defaultProfile?.id] ?
                    collectors[items[i].defaultProfile?.id].collects.push(publication) :
                    collectors[items[i].defaultProfile?.id] = { collects: [publication], defaultProfile: items[i].defaultProfile }
            }
            const commentsResponse = await getComments(publication.id)
            for (let i = 0; i < commentsResponse.length; i++){
                comments[commentsResponse[i].profile?.id] ?
                    comments[commentsResponse[i].profile?.id].comments.push(publication) :
                    comments[commentsResponse[i].profile?.id] = { comments: [publication], profile: commentsResponse[i].profile }
            }
        }
        delete collectors['undefined']
        let array = Object.keys(collectors).map((key) => {
            return collectors[key]
        })
        if (array.length > 0) {
            let best = array.reduce((prev, current) => (prev.collects.length > current.collects.length) ? prev : current)
            bestCollector = { profile: best.defaultProfile, amount: best.collects.length }
        } else {
            bestCollector = null
        }
        delete comments['undefined']
        array = Object.keys(comments).map((key) => {
            return comments[key]
        })
        if (array.length > 0) {
            let best = array.reduce((prev, current) => (prev.comments.length > current.comments.length) ? prev : current)
            console.log(best)
            bestCommentator = { profile: best.profile, amount: best.comments.length }
        } else {
            bestCommentator = null
        }
        return {
            bestCollector,
            bestCommentator
        }
    } catch (err) {
        console.log('error fetching stats...', err)
    }
}

async function getComments(id: string) {
    try {
        const comments = await basicClient.query(getPublicationsQuery, {
            request: { commentsOf: id }
        }).toPromise()
        return comments.data.publications.items
    } catch (err) {
        console.log('Error fetching comments...', err)
    }
}
