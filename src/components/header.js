import { Link, useStaticQuery } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "ccp_logo.png"}) {
        childImageSharp {
          resize(height: 30, width: 150) {
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
    <header className="bg-black h-8 flex items-center justify-start">
      <Link className="ml-2" to="/">
        <Img className="align-middle" fixed={data.file.childImageSharp.resize} />
      </Link>
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
      <FontAwesomeIcon className="text-white ml-auto mr-5" icon={faSearch} />
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
