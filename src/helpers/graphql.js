import { graphql } from 'gatsby';

export const sermonOveriew = graphql`
  fragment SermonOverview on Sermon {
      fullTitle
      preachDate
      bibleText
      slug
      speaker {
        displayName
        roundedThumbnailImageURL
      }
      series {
        title
      }
      downloadCount
  }
`

export const blogPostOverview = graphql`
  fragment BlogPostOverview on WpPost {
    date
    excerpt
    slug
    title
  }
`
