import React from "react"
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"
import Img from "gatsby-image"

const Carousel = ({ data, totalSlides, headerHeight }) => {
  console.log("props", data)
  return (
    <CarouselProvider
      className="h-full"
      naturalSlideWidth={100}
      totalSlides={totalSlides}
      naturalSlideHeight={100}>
      <Slider className="h-auto w-full">
        {data.mobile_images.edges
          .sort((edge1, edge2) => {
            if (edge1.node.name.includes('welcome')) return -1
            if (edge2.node.name.includes('welcome')) return 1
            return 0
          })
          .map((edge, i) => (
            <Slide className="h-auto w-full" index={i}>
              <Img className="h-auto w-full" fluid={edge.node.childImageSharp.fluid} />
            </Slide>
        ))}
      </Slider>
      {/* <ButtonBack>
        <FontAwesomeIcon icon={faChevronCircleLeft} color="white" size="lg"/>
      </ButtonBack>
      <ButtonNext className="relative" style={{ bottom: headerHeight }}>
        <FontAwesomeIcon icon={faChevronCircleRight} color="white" size="lg" />
      </ButtonNext> */}
    </CarouselProvider>
  )
}

export default Carousel
