import React, { useState } from "react"
import { graphql } from "gatsby"
import moment from "moment"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SearchResults from "../components/searchResults"
import { useInfiniteScroll } from "../helpers/hooks"
import { HighlightedText } from "../helpers/searchHelpers"

export const SermonExcerpt = ({
  sermon,
  searchString
}) => (
  <React.Fragment>
    {sermon.series && sermon.series.title && (
      <strong className="flex justify-center">
        <HighlightedText text={sermon.series.title} searchString={searchString} />
      </strong>
    )}
    <strong className="flex justify-center">
      <HighlightedText text={sermon.bibleText} searchString={searchString} />
    </strong>
    <div className="flex items-center justify-center flex-col md:flex-row py-4">
      <Img 
        style={{ height: '50px', width: '50px' }}
        fluid={{
          src: sermon.speaker.roundedThumbnailImageURL
        }} />
      <strong className="pl-2 text-center md:text-left">
        <HighlightedText text={sermon.speaker.displayName} searchString={searchString} />
      </strong>
    </div>
    <strong className="flex justify-center">{moment(sermon.preachDate).format('dddd MMMM Do, YYYY')}</strong>
    <span className="flex justify-center">{`Downloaded ${sermon.downloadCount} times.`}</span>
  </React.Fragment>
)

export default ({ data }) => {
  const [endIndex, setEndIndex, handleScroll] = useInfiniteScroll(100)
  const [searchString, setSearchString] = useState('')

  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 min-h-full my-2" onScroll={handleScroll}>
      <SEO title="Christ Church Presbyterian Sermons" />
      <h1 className="text-center my-4">Sermons</h1>
      <SearchResults
        submitOnType
        data={data.allSermon.edges}
        searchString={searchString}
        setSearchString={setSearchString}
        endIndex={endIndex}
        setEndIndex={setEndIndex} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allSermon(sort: { order: DESC, fields: preachDate }) {
      edges {
        node {
          preachDate
          bibleText
          downloadCount
          slug
          series {
            title
            count
          }
          fullTitle
          speaker {
            displayName
            roundedThumbnailImageURL
          }
          media {
            audio {
              streamURL
              mediaType
              duration
              downloadURL
            }
          }
          id
        }
      }
    }
  }
`
