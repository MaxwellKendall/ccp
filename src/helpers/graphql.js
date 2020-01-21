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
  fragment blogPostOverview on wordpress__POST {
    date
    excerpt
    slug
    title
  }
`
