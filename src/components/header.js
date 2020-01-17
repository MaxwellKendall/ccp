import { Link, useStaticQuery } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import React, { useState } from "react"

const Header = ({ siteTitle, siteDescription }) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "ccp_logo.png"}) {
        childImageSharp {
          resize(width: 250) {
            src
            tracedSVG
            width
            height
            aspectRatio
          }
        }
      }
    }
  `)
  return (
    <header className="bg-black p-4 flex items-center justify-start">
      <Link className="ml-2 flex items-center w-11/12" to="/">
        <Img className="align-middle" fixed={data.file.childImageSharp.resize} />
        <span className="my-0 text-white ml-8 italic">{siteDescription}</span>
      </Link>
      <FontAwesomeIcon className="text-white ml-auto mr-5" icon={faSearch} />
      <ul className="my-0 mx-auto flex">
        <li className="my-0 text-white mr-2">
          <Link to={`blog`}>Blog</Link>
        </li>
        <li className="my-0 text-white mr-2">
          <Link to={`sermons`}>Sermons</Link>
        </li>
        <li className="my-0 text-white">
          <Link to={`events`}>Events</Link>
        </li>
      </ul>
    </header>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
