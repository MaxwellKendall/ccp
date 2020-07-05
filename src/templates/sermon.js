import React from "react"
import Player from "react-player"
import moment from "moment"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const sermon = data.allSermon.edges[0].node
  const audioAsset = sermon.media.audio[0].downloadURL
  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 h-full">
      <div className="md:py-4 text-center h-full">
        <h1>{sermon.fullTitle}</h1>
        <h2>from the sermon series, {sermon?.series?.title}</h2>
        <h2>{`${sermon.speaker.displayName}, ${moment(sermon.preachDate).format('dddd MMMM Do, YYYY')}`}</h2>
        <p>{sermon.bibleText}</p>
        <p>Downloaded {sermon.downloadCount} times</p>
          <Player
            className="audio-player"
            controls
            playing={false}
            url={audioAsset}
            width="100%"
            height=""
            style={{ background: `url(${sermon.speaker.roundedThumbnailImageURL}) no-repeat center`}}/>
      </div>
    </Layout>
  )
}
export const query = graphql`
  query($id: String!) {
    allSermon(filter: { id: { eq: $id } }) {
      edges {
        node {
          ...SermonOverview
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
