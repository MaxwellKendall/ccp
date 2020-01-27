import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"


import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => {
  console.log("Data", data.mobile_images);
  return (
    <Layout>
      <SEO title="Home" />
      <CarouselProvider
        className="h-full"
        naturalSlideWidth={100}
        naturalSlideHeight={25}
        totalSlides={data.mobile_images.edges.length}
        interval={5}
      >
        <Slider className="h-auto w-full">
          {data.mobile_images.edges
            .sort((edge1, edge2) => {
              if (edge1.node.name.includes('welcome')) return -1
              if (edge2.node.name.includes('welcome')) return 1
              return 0
            })
            .map((edge, i) => (
              <Slide className="h-auto w-full" index={i}>
                <Img className="h-auto w-full" fluid=   {edge.node.childImageSharp.fluid} />
              </Slide>
          ))}
        </Slider>
        <ButtonBack>
          <FontAwesomeIcon icon={faChevronCircleLeft} color="white" size="lg"/>
        </ButtonBack>
        <ButtonNext>
          <FontAwesomeIcon icon={faChevronCircleRight} color="white" size="lg" />
        </ButtonNext>
      </CarouselProvider>
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
            }
          }
        }
      }
    }
  }
`
