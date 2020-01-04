import { Link, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "ccp_logo.png"}) {
        childImageSharp {
          resize(height: 144) {
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
    <header className="bg-black">
      <Link to="/">
        <Img fixed={data.file.childImageSharp.resize} />
        <h1>{siteTitle}</h1>
      </Link>
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
