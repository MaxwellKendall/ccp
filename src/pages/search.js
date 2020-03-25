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
      get(node, 'title', '').toLowerCase().includes(searchString.toLowerCase()) ||
      get(node, 'excerpt', '').toLowerCase().includes(searchString.toLowerCase())
    )
  }

  return (
    get(node, 'fullTitle', '').toLowerCase().includes(searchString.toLowerCase()) ||
    (node.bibleText && get(node, 'bibleText', '').toLowerCase().includes(searchString.toLowerCase())) ||
    get(node, 'speaker.displayName', '').toLowerCase().includes(searchString.toLowerCase()) ||
    get(node, 'series.title', '').toLowerCase().includes(searchString.toLowerCase())
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

  const { sermons, blogs, total } = results
    .reduce((acc, result) => {
      if (isBlogPost(result.node)) return { ...acc, blogs: acc.blogs + 1, total: acc.total + 1 };
      return { ...acc, sermons: acc.sermons + 1, total: acc.total + 1 }
    }, { sermons: 0, blogs: 0, total: 0});

  return (
    <Layout classNames="ccp-search-pg mx-auto flex flex-col py-10 px-5" onScroll={handleScroll}>
      <SEO title="Search Results" />
      <h1 className="text-center my-4">Search Results</h1>
      <div className="flex justify-center w-1/2 pb-4">
        <SearchInput
          submitOnType
          classNames="w-1/2"
          submitSearch={submitSearch}
          initialSearchString={defaultSearchString}
          placeHolder="Search Sermons and Blogs..." />
      </div>
      <span className="justify-center flex text-center py-4">{`${sermons} sermons, ${blogs} blogs, (${total} total)`}</span>
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
            ...BlogPostOverview
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
