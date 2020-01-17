const moment = require("moment")
const path = require("path")
require("dotenv").config()

const {
  WORDPRESS_PASSWORD,
  WORDPRESS_CLIENT_SECRET,
  WORDPRESS_CLIENT_ID,
  GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY,
  SERMON_AUDIO_API_KEY,
  GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
  GOOGLE_DRIVE_FOLDER_ID
} = process.env

module.exports = {
  siteMetadata: {
    title: `Christ Church, Charleston, SC (PCA)`,
    description: `Biblical. Confessional. Reformed. Reverent.`,
    author: `Maxwell Kendall`,
    address: '46 Wando Park BLVD'
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require("tailwindcss"),
          // require("./tailwind.config.js"), // Optional: Load custom Tailwind CSS configuration
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
      resolve: 'gatsby-source-gdrive',
      options: {
        folderId: GOOGLE_DRIVE_FOLDER_ID,
        key: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
        destination: path.join(__dirname, 'src/drive')
      }
    },
    {
      resolve: `gatsby-source-google-calendar-events`,
      options: {
        envVar: GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY,
        assumedUser: "info@ckendallart.com",
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
        ],
        calendarId:
          "ckendallart.com_kgegbfntrrqihkb5k2rqu1pouc@group.calendar.google.com",
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
        icon: `src/drive/ccp_favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        /*
         * The base URL of the WordPress site without the trailingslash and the protocol. This is required.
         * Example : 'gatsbyjsexamplewordpress.wordpress.com' or 'www.example-site.com'
         */
        baseUrl: `testchurch647917276.wordpress.com`,
        // baseUrl: `wpexample.com`,
        // The protocol. This can be http or https.
        protocol: `https`,
        // Indicates whether the site is hosted on wordpress.com.
        // If false, then the assumption is made that the site is self hosted.
        // If true, then the plugin will source its content on wordpress.com using the JSON REST API V2.
        // If your site is hosted on wordpress.org, then set this to false.
        hostingWPCOM: true,
        // If useACF is true, then the source plugin will try to import the WordPress ACF Plugin contents.
        // This feature is untested for sites hosted on wordpress.com.
        // Defaults to true.
        useACF: false,
        auth: {
          // If auth.user and auth.pass are filled, then the source plugin will be allowed
          // to access endpoints that are protected with .htaccess.
          htaccess_user: "your-htaccess-username",
          htaccess_pass: "your-htaccess-password",
          htaccess_sendImmediately: false,

          // If hostingWPCOM is true then you will need to communicate with wordpress.com API
          // in order to do that you need to create an app (of type Web) at https://developer.wordpress.com/apps/
          // then add your clientId, clientSecret, username, and password here
          // Learn about environment variables: https://www.gatsbyjs.org/docs/environment-variables
          // If two-factor authentication is enabled then you need to create an Application-Specific Password,
          // see https://en.support.wordpress.com/security/two-step-authentication/#application-specific-passwords
          wpcom_app_clientSecret: WORDPRESS_CLIENT_SECRET,
          wpcom_app_clientId: WORDPRESS_CLIENT_ID,
          wpcom_user: "maxwell.n.kendall@gmail.com",
          wpcom_pass: WORDPRESS_PASSWORD,

          // If you use "JWT Authentication for WP REST API" (https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
          // or (https://github.com/jonathan-dejong/simple-jwt-authentication) requires jwt_base_path, path can be found in WordPress wp-api.
          // plugin, you can specify user and password to obtain access token and use authenticated requests against WordPress REST API.
          jwt_user: process.env.JWT_USER,
          jwt_pass: process.env.JWT_PASSWORD,
          jwt_base_path: "/jwt-auth/v1/token", // Default - can skip if you are using https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
        },
      },
    },
  ],
}
