const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  // create blog post pages
  return graphql(`
    {
      allWpPost(sort: { fields: [date] }) {
        edges {
          node {
            title
            excerpt
            content
            slug
          }
        }
      }
      allSermon(filter: {}, sort: { fields: preachDate, order: DESC }) {
        edges {
          node {
            preachDate
            bibleText
            downloadCount
            series {
              title
              count
            }
            slug
            fullTitle
            speaker {
              bio
              displayName
              portraitURL
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
      allGoogleCalendarEvent {
        edges {
          node {
            summary
            id
            slug
            start {
              dateTime
            }
            description
            location
            status
          }
        }
      }
    }
  `)
    .then(result => {
      result.data.allWpPost.edges.forEach(({ node }) => {
        createPage({
          path: `blog/${node.slug}`,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // This is the $slug variable
            // passed to blog-post.js
            slug: node.slug,
          },
        })
      })
      result.data.allSermon.edges.forEach(({ node }) => {
        createPage({
          path: `sermons/${node.slug}`,
          component: path.resolve(`./src/templates/sermon.js`),
          context: {
            // This is the $slug variable
            // passed to blog-post.js
            id: node.id,
          },
        })
      })
      result.data.allGoogleCalendarEvent.edges.forEach(({ node }) => {
        createPage({
          path: `events/${node.slug}`,
          component: path.resolve(`./src/templates/event.js`),
          context: {
            // This is the $slug variable
            // passed to blog-post.js
            id: node.id,
          },
        })
      })
    })
    .catch(e => console.log("error: ", error))
}
