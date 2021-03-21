import React, { useState } from "react"
import { graphql } from "gatsby"
import { get } from "lodash"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SearchResults from "../components/searchResults"

import { useInfiniteScroll } from "../helpers/hooks"

export default ({
  data,
  location
}) => {
  const [endIndex, setEndIndex, handleScroll] = useInfiniteScroll(100)

  const defaultSearchString = get(location, 'state.searchString', '')
  const [searchString, setSearchString] = useState(defaultSearchString)
  
  return (
    <Layout classNames="ccp-search-pg" onScroll={handleScroll}>
      <SEO title="Search Results" />
      <h1 className="text-center my-4">Search Results</h1>
      <SearchResults
        submitOnType
        data={[...data.allWordpressPost.edges, ...data.allSermon.edges]}
        searchString={searchString}
        setSearchString={setSearchString}
        endIndex={endIndex}
        setEndIndex={setEndIndex} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query searchPageQuery {
    allWordpressPost: allWpPost {
        edges {
          node {
            ...BlogPostOverview
            id
          }
        }
    }
    allSermon {
        edges {
            node {
                ...SermonOverview
                id
            }
        }
    }
  }
`
