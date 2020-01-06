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
      <br />
      <br />
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
