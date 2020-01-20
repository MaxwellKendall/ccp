import React, { useState, useCallback } from "react"
import { Link, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import cx from "classnames"

import MenuSearch from "../icons/menuSearch"

const Header = React.forwardRef(({ siteDescription, headerHeight }, ref) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "ccp_logo.png"}) {
        childImageSharp {
          fluid(maxWidth: 250, quality: 100) {
            ...GatsbyImageSharpFluid
            presentationWidth
        }
      }
    }
  }
  `)

  const [isNavVisible, showNav] = useState(false);
  const toggleNav = () => showNav(!isNavVisible);
  
  return (
    <header ref={ref} className="p-4 fixed w-full left-0 top-0 flex flex-row items-center justify-start">
      <Link className="w-5/6 md:w-11/12 flex flex-col self-start md:ml-2" to="/">
        <Img className="align-middle" fluid={data.file.childImageSharp.fluid} />
      </Link>
      <span className="my-0 hidden md:flex text-white md:ml-8 text-center italic">{siteDescription}</span>
      <MenuSearch buttonClassName="ml-auto" isNavVisible={isNavVisible} toggleNav={toggleNav} />
      <ul style={{ marginTop: headerHeight }} className={cx(`ccp-nav flex flex-col text-center flex-center items-center`, { 'show-nav': isNavVisible })}>
        <li className="mb-8 mt-4"><span className="my-0 flex text-white text-center italic">{siteDescription}</span></li>
        <li className="py-6 w-3/4 border-white my-0">
          <Link to={`blog`}>Blog</Link>
        </li>
        <li className="py-6 w-3/4 border-white my-0">
          <Link to={`sermons`}>Sermons</Link>
        </li>
        <li className="py-6 w-3/4 border-white my-0">
          <Link to={`events`}>Events</Link>
        </li>
      </ul>
    </header>
  );
});

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

Header.displayName = 'Header'

export default Header
