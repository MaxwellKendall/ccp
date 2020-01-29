import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/card"

export default ({ data }) => {
  return (
    <Layout className="mx-auto flex flex-col py-10 px-5">
      <SEO title="blog" />
      <h1>Doctrine for Life</h1>
      {data.allWordpressPost.edges.map(({ node }) => (
        <Card
          title={node.title}
          slug={`blog/${node.slug}`}>
            <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </Card>
      ))}
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
  }
`
