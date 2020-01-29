import React, { useState } from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"
import { slice } from "lodash"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/card"
import { useInfiniteScroll } from "../helpers/hooks"

export const SermonExcerpt = 
({ sermon }) => (
  <React.Fragment>
    <div className="flex items-center justify-center md:justify-start flex-col md:flex-row pb-2">
      <Img 
        style={{ height: '50px', width: '50px' }}
        fluid={{
          src: sermon.speaker.roundedThumbnailImageURL
        }} />
      <strong className="pl-2 text-center md:text-left">{`${sermon.speaker.displayName} on ${sermon.bibleText}; preached ${moment(sermon.preachDate).format('LL')}.`}
      </strong>
    </div>
    <span className="italic">{`Downloaded ${sermon.downloadCount} times.`}</span>
  </React.Fragment>
)

export default ({ data }) => {
  const [endIndex, _, handleScroll] = useInfiniteScroll(100)
  return (
    <Layout className="mx-auto flex flex-col py-10 px-5" onScroll={handleScroll}>
      <SEO title="Christ Church Presbyterian Sermons" />
      <h1>Sermons</h1>
      {slice(data.allSermon.edges, 0, endIndex)
        .map(({ node }) => (
          <Card
            key={node.id}
            title={node.fullTitle}
            slug={`sermons/${node.slug}`}
            element={<SermonExcerpt sermon={node} />}
          />
        ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allSermon(sort: { order: DESC, fields: preachDate }) {
      edges {
        node {
          preachDate
          bibleText
          downloadCount
          slug
          series {
            title
            count
          }
          fullTitle
          speaker {
            displayName
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
