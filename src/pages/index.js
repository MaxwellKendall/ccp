import React from "react"
import { graphql } from "gatsby"
import moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Carousel from "../components/carousel"
import Card from "../components/card"
import { SermonExcerpt } from "./sermons"

export default ({ data }) => {
  const { images, recentSermons, upcomingEvents, recentBlogPosts } = data
  return (
    <Layout>
      <SEO title="Home" />
      <Carousel
        data={images}
        totalSlides={images.edges.length} />
        <h2>Upcoming Events</h2>
        {upcomingEvents.edges
          .filter(({ node }) => {
            return (moment(node.start.dateTime).isAfter(moment()))
          })
          .slice(0, 5)
          .map(({ node }) => (
              <Card slug={`events/${node.slug}`} title={node.summary} key={node.id}>
                <>
                  <p>{node.description}</p>
                  <p>{node.location}</p>
                  {node.attachments && (
                    node.attachments.map((attachment) => {
                      return <a href={attachment.fileUrl}>{attachment.title}</a>
                    })
                  )}
                </>
              </Card>
        ))}
        <h2>Recent Sermons</h2>
        {recentSermons.edges
          // .map(({ node }) => console.log("sermon", sermon) true)
          .map(({ node }) => {
            console.log("sermon", node)
            return (
              <Card slug={`sermons/${node.slug}`} key={node.id} title={node.fullTitle}>
                <SermonExcerpt sermon={node} />
              </Card>
            )
          })}
        <h2>Recent Articles</h2>
        {recentBlogPosts.edges
          .map(({ node }) => (
            <Card slug={`blog/${node.slug}`} title={node.title}>
              <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
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
    recentBlogPosts: allWordpressPost(limit: 4, sort: {fields: date, order: DESC}) {
      edges {
        node {
          ...BlogPostOverview
          wordpress_id
        }
      }
    }
    recentSermons: allSermon(limit: 4, sort: {fields: preachDate, order: DESC}) {
      edges {
        node {
          ...SermonOverview
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
