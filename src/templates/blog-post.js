import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const [post] = data.posts.nodes;
  return (
    <Layout>
      <div className="px-4 my-2 rounded md:mx-4 lg:bg-white ccp-blog__container md:p-4 lg:px-24">
        <h1 className="text-center my-4" dangerouslySetInnerHTML={{ __html: post.title }} />
        <div className="ccp-blog__content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Layout>
  )
}
export const query = graphql`
  query($slug: String!) {
    posts: allWpPost(filter: {slug: {eq: $slug }}) {
      nodes {
        title
        content
      }
    }
  }
`
