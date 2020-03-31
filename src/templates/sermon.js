import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const sermon = data.allSermon.edges[0].node
  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 h-full">
      <div className="md:py-4">
        <h1>Sermon Title: {sermon.fullTitle}</h1>
        <h2>Speaker: {sermon.speaker.displayName}</h2>
        <p>Download Count: {sermon.downloadCount} </p>
        <p>Bible Passage: {sermon.bibleText}</p>
        <audio controls src={`${sermon.media.audio[0].downloadURL}`} />
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
