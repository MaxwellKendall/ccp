import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const sermon = data.allSermon.edges[0].node;
  console.log("sermon", sermon)
  return (
    <Layout>
      <div>
        <h1>Sermon Title: {sermon.fullTitle}</h1>
        <h2>Speaker: {sermon.speaker.displayName}</h2>
        <p>Download Count: {sermon.downloadCount} </p>
        <audio controls src={`${sermon.media.audio[0].downloadURL}`} />
      </div>
    </Layout>
  )
}
export const query = graphql`
  query($id: String!) {
    allSermon(filter: {id: {eq: $id}}) {
        edges {
          node {
            preachDate
            bibleText
            downloadCount
            series {
              title
              count
            }
            fullTitle
            speaker {
              bio
              displayName
              portraitURL
              roundedThumbnailImageURL
            }
            media {
              audio {
                streamURL
                mediaType
                duration
                downloadURL
              }
            }
            id
          }
        }
      }
  }
`
