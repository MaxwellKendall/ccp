import React, { useState } from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Carousel from "../components/carousel"

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <Carousel
        data={data}
        totalSlides={data.mobile_images.edges.length} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query HomePage {
    mobile_images: allFile(filter: {relativePath: {regex: "/featured/"}}) {
      edges {
        node {
          name
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
              presentationHeight
              aspectRatio
            }
          }
        }
      }
    }
  }
`
