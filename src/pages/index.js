import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => {
  const { wordpressPage } = data;
  return (
    <Layout>
        <SEO title="home" />
        <h1>CCP v2</h1>
        <div dangerouslySetInnerHTML={{ __html: wordpressPage.content }} />
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
    wordpressPage(path: {eq: "/"}) {
      content
    }
  }
`