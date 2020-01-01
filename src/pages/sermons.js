import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="CCP Sermon Archive" />
      <h1>CCP Sermon Archive</h1>
      <h4>Sermons</h4>
      {data.allSermon.edges.map(({ node }) => (
        <Link to={`sermons/${node.slug}`}>
          <p>{node.fullTitle}</p>
          <p>{node.speaker.displayName}</p>
        </Link>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allSermon(sort: {order: DESC, fields: preachDate}) {
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
