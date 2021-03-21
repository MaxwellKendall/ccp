import React from 'react'
import { get } from "lodash"
import Highlighter from "react-highlight-words"

export const HighlightedText = ({
  searchString,
  text
}) => (
  <Highlighter
    highlightClassName="highlight-search-result"
    searchWords={searchString.split(' ')}
    autoEscape={true}
    textToHighlight={text} />
)

export const isBlogPost = (node) => {
  console.log('node', node)
    return Object.keys(node).includes("excerpt")
}
  
export const isMatchingResult = (node, searchString) => {
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
};
