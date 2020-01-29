import React, { useState } from "react"
import { graphql } from "gatsby"
import moment from "moment"
import { camelCase } from "lodash"
import cx from "classnames"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Carousel from "../components/carousel"
import Card from "../components/card"
import { SermonExcerpt } from "./sermons"

const subMenu = ["Upcoming Events", "Recent Sermons", "Recent Articles"]

const filterEvents = (event) => {
  return moment(event.start.dateTime).isAfter(moment())
}

const ActiveSection = ({ section, data }) => {
  console.log(section, data, "******")
  if (section === "upcomingEvents") {
    return data.upcomingEvents.edges
      .filter(({ node }) => filterEvents(node))
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
    ))
  }
  else if (section === "recentSermons") {
    return data.recentSermons.edges
      .map(({ node }) => {
        console.log("sermon", node)
        return (
          <Card slug={`sermons/${node.slug}`} key={node.id} title={node.fullTitle}>
            <SermonExcerpt sermon={node} />
          </Card>
        )
      })
  }
  else if (section === "recentArticles") {
    return data.recentBlogPosts.edges
      .map(({ node }) => (
        <Card slug={`blog/${node.slug}`} title={node.title}>
          <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </Card>
      ))
  }
  return null
}

export default ({ data }) => {
  const [activeTab, setActiveTab] = useState(camelCase(subMenu[0]))

  return (
    <Layout>
      <SEO title="Home" />
      <Carousel
        data={data.images}
        totalSlides={data.images.edges.length} />
        <ul className="m-0 flex items-center home-page__subnav">
          {subMenu.map((item, i) => (
            <li
              className={`rounded text-center font-semibold px-2 py-6 m-0 w-full ${cx({ active: activeTab === camelCase(item)})}`}
              onClick={setActiveTab.bind(null, camelCase(item))}
              key={i}>
                {item}
            </li>))}
        </ul>
        <ActiveSection section={activeTab} data={data} />
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
