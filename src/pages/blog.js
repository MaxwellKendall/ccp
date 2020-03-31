import React, { useState } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SearchResults from "../components/searchResults"

import { useInfiniteScroll } from "../helpers/hooks"

export default ({ data }) => {
  const [endIndex, setEndIndex, handleScroll] = useInfiniteScroll(100)
  const [searchString, setSearchString] = useState('')

  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 min-h-full my-2" onScroll={handleScroll}>
      <SEO title="Doctrine for Life" />
      <h1 className="text-center my-4">Doctrine for Life</h1>
      <SearchResults
        submitOnType
        data={data.allWordpressPost.edges}
        searchString={searchString}
        setSearchString={setSearchString}
        endIndex={endIndex}
        setEndIndex={setEndIndex} />
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
          wordpress_id
        }
      }
    }
  }
`
