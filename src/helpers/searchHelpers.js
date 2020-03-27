import { get } from "lodash"

export const isBlogPost = (node) => {
    return Object.keys(node).includes("wordpress_id")
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
