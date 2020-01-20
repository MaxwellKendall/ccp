import React from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"
import { slice } from "lodash"

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
        <span>{`On ${sermon.bibleText}`}</span>
      </div>
      <span className="italic">{`Downloaded ${sermon.downloadCount} times.`}</span>
    </React.Fragment>
  )

  return (
    <Layout className="mx-auto flex flex-col py-10 px-5">
      <SEO title="Search Results" />
      <h1>Search Results</h1>
      {slice(data.allWordpressPost.edges, 0, 100)
        .map(({ node }) => (
            <Card
                title={node.title}
                slug={`blog/${node.slug}`}
                element={<div dangerouslySetInnerHTML={{ __html: node.excerpt }} />}
            />
      ))}
      {slice(data.allSermon.edges, 0, 100)
        .map(({ node }) => (
            <Card
                title={node.fullTitle}
                slug={`sermons/${node.slug}`}
                element={getSermonExcerpt(node)}
                />
        ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query searchPageQuery {
    allWordpressPost {
        edges {
          node {
            ...blogPostOverview
          }
        }
    }
    allSermon {
        edges {
            node {
                ...SermonOverview       
            }
        }
    }
  }
`
