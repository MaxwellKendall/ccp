import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Carousel from "../components/carousel"
import Card from "../components/card"

export default ({ data }) => {
  const { images, recentSermons, upcomingEvents } = data
  return (
    <Layout>
      <SEO title="Home" />
      <Carousel
        data={images}
        totalSlides={images.edges.length} />
        <h2>Upcoming Events</h2>
        {upcomingEvents.edges
          .filter(({ node }) => {
            console.log("node", node)
            return (moment(node.start.dateTime).isAfter(moment()))
          })
          .slice(0, 5)
          .map(({ node }) => (
              <Card slug={`events/${node.slug}`} title={node.summary}>
                <>
                  <p>{node.description}</p>
                  <p>{node.location}</p>
                  {node.attachments && (
                    node.attachments.map((attachment) => {
                      <a href={attachment.fileUrl}>{attachment.title}</a>
                    })
                  )}
                </>
              </Card>
            ))
        }
    </Layout>
  )
}

export const pageQuery = graphql`
  query HomePage {
    images: allFile(filter: {relativePath: {regex: "/featured/"}}) {
      edges {
        node {
          name
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
              presentationHeight
              aspectRatio
            }
          }
        }
      }
    }
    recentSermons: allSermon(limit: 10, sort: {fields: preachDate, order: DESC}) {
      edges {
        node {
          fullTitle
          downloadCount
          slug
          series {
            title
            count
            updated
            type
            latest
            seriesID
            earliest
          }
          speaker {
            roundedThumbnailImageURL
            displayName
          }
          preachDate
        }
      }
    }
    upcomingEvents: allGoogleCalendarEvent(limit: 100) {
      edges {
        node {
          location
          slug
          status
          summary
          description
          start {
            date
            dateTime
          }
          id
          attachments {
            fileUrl
            title
          }
        }
      }
    }
  }
`
