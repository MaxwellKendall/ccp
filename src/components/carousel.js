import React, { createRef, useEffect, useState } from "react"
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"
import Img from "gatsby-image"

const offset = 55

const getButtonPosition = (state, buttonType) => {
  if (state.height && state.width) {
    return {
      bottom: `${state.height / 2}px`,
      left: buttonType === 'next'
        ? `${state.width - offset}px`
        : `10px`
    }
  }
  return null
}

const Carousel = ({ data, totalSlides }) => {
  const carousel = createRef()
  const aspectRatio = data.mobile_images.edges[0].node.childImageSharp.fluid.aspectRatio
  const [buttonPosition, setButtonPosition] = useState({ height: null, width: null })
  
  useEffect(() => {
    if(carousel.current && buttonPosition.height
       !== carousel.current.offsetHeight) {
      setButtonPosition({ height: carousel.current.offsetHeight, width: carousel.current.offsetWidth })
    }
  }, [carousel, setButtonPosition])
  
  return (
    <div ref={carousel}>
      <CarouselProvider
        className="w-full"
        naturalSlideHeight={1}
        naturalSlideWidth={aspectRatio}
        totalSlides={totalSlides}>
        <Slider className="h-full w-full">
          {data.mobile_images.edges
            .sort((edge1, edge2) => {
              if (edge1.node.name.includes('welcome')) return -1
              if (edge2.node.name.includes('welcome')) return 1
              return 0
            })
            .map((edge, i) => (
              <Slide className="h-full w-full nice-transition" index={i}>
                <Img className="h-full w-full" fluid={edge.node.childImageSharp.fluid}/>
              </Slide>
          ))}
          </Slider>
          <ButtonBack className="relative" style={getButtonPosition(buttonPosition, 'back')}>
            <FontAwesomeIcon icon={faChevronCircleLeft} color="white" size="lg"/>
          </ButtonBack>
          <ButtonNext className="relative" style={getButtonPosition(buttonPosition, 'next')}>
            <FontAwesomeIcon icon={faChevronCircleRight} color="white" size="lg" />
          </ButtonNext>
      </CarouselProvider>
    </div>
  )
}

export default Carousel
