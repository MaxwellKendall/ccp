const moment = require("moment")
const path = require("path")
require("dotenv").config()

const {
  WORDPRESS_URL,
  GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY,
  SERMON_AUDIO_API_KEY,
  GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
  GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_ASSUMED_USER
} = process.env

module.exports = {
  siteMetadata: {
    title: `Christ Church, Charleston, SC (PCA)`,
    description: `Biblical. Confessional. Reformed. Reverent.`,
    author: `Maxwell Kendall`,
    address: '46 Wando Park BLVD',
    links: [
      {
        label: 'Welcome',
        link: '/welcome'
      },
      {
        label: 'About',
        link: '/about',
        children: [
          {
            label: 'What we Believe',
            link: '/about/beliefs'
          },
          {
            label: 'Our Staff',
            link: '/about/staff'
          },
          {
            label: 'Our History',
            link: '/about/history'
          }
        ]
      },
      {
        label: 'Sermons',
        link: '/sermons'
      },
      {
        label: 'Blog',
        link: '/blog'
      },
      {
        label: 'Events',
        link: '/events'
      },
    ]
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("node-sass"),
        postCssPlugins: [
          require("tailwindcss"),
          // Optional: Load custom Tailwind CSS configuration
          require("./tailwind.config.js")
        ],
      },
    },
    {
      resolve: `gatsby-source-sermon-audio`,
      options: {
        apiKey: SERMON_AUDIO_API_KEY,
      },
    },
    {
      resolve: 'gatsby-plugin-copy-gdrive-folder',
      options: {
        folderId: GOOGLE_DRIVE_FOLDER_ID,
        key: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
        destination: path.join(__dirname, 'src/drive'),
        scopes: [
          'https://www.googleapis.com/auth/drive'
        ]
      }
    },
    {
      resolve: `gatsby-source-google-calendar-events`,
      options: {
        envVar: GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY,
        assumedUser: GOOGLE_CALENDAR_ASSUMED_USER,
        includedFields: [
          "start",
          "end",
          "summary",
          "status",
          "organizer",
          "description",
          "location",
          "slug",
          "attachments",
          "geoCoordinates"
        ],
        calendarId: GOOGLE_CALENDAR_ID,
        timeMax: moment()
          .add(1, "y")
          .format(),
        timeMin: moment()
          .subtract(3, "M")
          .format(),
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `drive-data`,
        path: `${__dirname}/src/drive`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./ccp_favicon.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        /*
         * The full URL of the WordPress site's GraphQL API.
         * Example : 'https://www.example-site.com/graphql'
         */
        url: WORDPRESS_URL,
      },
    },
  ],
}
