import React, { useState } from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"
import { slice } from "lodash"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/card"

export default ({ data }) => {
  const totalItems = data.allWordpressPost.edges.length + data.allSermon.edges.length
  const divisor = totalItems / 100
  const [endIndex, setEndIndex] = useState(totalItems / divisor)

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

  const handleScroll = e => {
    const { scrollHeight, scrollTop, clientHeight } = e.target
    const pxTilBottom = scrollHeight - scrollTop
    // 100px before they get to the bottom of the screen
    const shouldAddMoreScrollingSpace = pxTilBottom - 100 < clientHeight
    if (shouldAddMoreScrollingSpace) {
      setEndIndex(endIndex + 100)
    }
  }

  const isBlogPost = (node) => {
    console.log("Node", node)
    return Object.keys(node).includes("wordpress_id")
  }

  return (
    <Layout className="mx-auto flex flex-col py-10 px-5" onScroll={handleScroll}>
      <SEO title="Search Results" />
      <h1>Search Results</h1>
      {slice([
        ...data.allWordpressPost.edges,
        ...data.allSermon.edges
       ], 0, endIndex)
        .map(({ node }) => (
            <Card
                title={node.title}
                slug={isBlogPost(node) ? `blog/${node.slug}` : `sermons/${node.slug}`}
                element={
                  isBlogPost(node)
                    ? <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                    : getSermonExcerpt(node)
                }
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
            wordpress_id
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
