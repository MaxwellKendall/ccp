import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"

export default ({ data }) => {
  const { wordpressPage } = data
  return (
    <Layout>
      <SEO title="home" />
      <Image imgPath={'welcome_to_ccp.png'} />
      <Link to={`blog`}>Go to the Blog</Link>
      <br />
      <Link to={`sermons`}>Go to the Sermon Archive</Link>
      <br />
      <Link to={`events`}>Go to the Events Page</Link>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allWordpressPost(sort: { fields: [date] }) {
      edges {
        node {
          title
          excerpt
          slug
        }
      }
    }
    wordpressPage(path: { eq: "/" }) {
      content
    }
  }
`
