import React, { useState, useEffect } from "react"
import { slice, get } from "lodash"
import Highlighter from "react-highlight-words";

import Card from "./card"
import SearchInput from "./searchInput"
import { SermonExcerpt } from "../pages/sermons"

import { isBlogPost, isMatchingResult } from "../helpers/searchHelpers"
import search from "../pages/search"

export default ({
  data,
  searchString,
  setSearchString,
  submitOnType,
  endIndex,
  setEndIndex
}) => {
  const [results, setResults] = useState([])

  useEffect(() => {
    const allItems = searchString === ""
      ? data
      : data.filter(({ node }) => isMatchingResult(node, searchString))
    const totalItems = allItems.length
    const divisor = totalItems >= 200
      ? totalItems / 100
      : 1
    
    setResults(allItems)
    setEndIndex(totalItems / divisor)

  }, [setResults, data, searchString, setEndIndex])

  const submitSearch = (str) => setSearchString(str)

  return (
      <>
        <div className="flex justify-center w-11/12 md:w-1/2 pb-4">
            <SearchInput
                submitOnType={submitOnType}
                classNames="w-1/2"
                submitSearch={submitSearch}
                initialSearchString={searchString}
                placeHolder="Filter search results..." />
        </div>
        <span className="justify-center flex text-center py-4">{`${results.length} matching, out of ${data.length} total`}</span>
        {slice(results, 0, endIndex)
            .map(({ node }) => {
              const isBlog = isBlogPost(node)
              const cleanExcerpt = 
              return (
                <Card
                    key={node.id || node.wordpress_id}
                    title={<Highlighter
                        highlightClassName="highlight-search-result"
                        searchWords={searchString.split(' ')}
                        autoEscape={true}
                        textToHighlight={isBlog ? node.title : node.fullTitle} />}
                    slug={isBlog ? `blog/${node.slug}/` : `sermons/${node.slug}/`}>
                    {isBlog
                        ? <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                        : <SermonExcerpt sermon={node} />}
                </Card>
              );
            }) 
        }
        </>
  )
}
