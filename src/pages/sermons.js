import React from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/card"

export default ({ data }) => {
  const getSermonExcerpt = sermon => (
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
  return (
    <Layout className="mx-auto flex flex-col py-10 px-5">
      <SEO title="Christ Church Presbyterian Sermons" />
      <h1>Sermons</h1>
      {data.allSermon.edges.map(({ node }) => (
        <Card
          title={node.fullTitle}
          slug={`sermons/${node.slug}`}
          element={getSermonExcerpt(node)}
        />
      ))}
      ;
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
