import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"
import { slice, get } from "lodash"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/card"
import SearchInput from "../components/searchInput"
import { SermonExcerpt } from "./sermons"
import { useInfiniteScroll } from "../helpers/hooks"

const isBlogPost = (node) => {
  return Object.keys(node).includes("wordpress_id")
}

const isMatchingResult = (node, searchString) => {
  if (isBlogPost(node)) {
    return (
      node.title.includes(searchString) ||
      node.excerpt.includes(searchString)
    )
  }

  return (
    node.fullTitle.includes(searchString) ||
    node.bibleText.includes(searchString) ||
    node.speaker.displayName.includes(searchString) ||
    get(node, 'node.series.title', '').includes(searchString)
  )
}

export default ({
  data,
  location
}) => {
  const [results, setResults] = useState([])
  const defaultSearchString = get(location, 'state.searchString', '')
  const [searchString, setSearchString] = useState(defaultSearchString)
  const [endIndex, setEndIndex, handleScroll] = useInfiniteScroll(100)

  useEffect(() => {
    const allItems = searchString === ""
      ? [...data.allWordpressPost.edges, ...data.allSermon.edges]
      : [...data.allWordpressPost.edges, ...data.allSermon.edges].filter(({ node }) => isMatchingResult(node, searchString))
    const totalItems = allItems.length
    const divisor = totalItems >= 200
      ? totalItems / 100
      : 1
    
    setResults(allItems)
    setEndIndex(totalItems / divisor)

  }, [setResults, data, searchString])

  const submitSearch = (str) => setSearchString(str)

  return (
    <Layout className="mx-auto flex flex-col py-10 px-5" onScroll={handleScroll}>
      <SEO title="Search Results" />
      <h1>Search Results</h1>
      <SearchInput submitSearch={submitSearch} />
      {slice(results, 0, endIndex)
        .map(({ node }) => (
            <Card
                key={node.id || node.wordpress_id}
                title={isBlogPost(node) ? node.title : node.fullTitle}
                slug={isBlogPost(node) ? `blog/${node.slug}/` : `sermons/${node.slug}/`}>
                  {isBlogPost(node)
                    ? <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                    : <SermonExcerpt sermon={node} />}
            </Card>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query searchPageQuery {
    allWordpressPost {
        edges {
          node {
            ...blogPostOverview
            wordpress_id
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
