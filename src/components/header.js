import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import cx from "classnames"

import MenuSearch from "../icons/menuSearch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const searchPlaceholder = "Sermons / Blogs"

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
  const [searchString, setSearchString] = useState("")
  const [searchResults, setSearchResults] = useState([])
  
  const toggleNav = () => showNav(!isNavVisible)

  const submitSearch = () => setSearchResults(searchString)

  const handleSearch = (e) => {
    e.preventDefault()
    if(e.keyCode === '13') {
      submitSearch()
    }
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }
  
  return (
    <header ref={ref} className="p-4 fixed w-full left-0 top-0 flex flex-row items-center justify-start">
      <Link className="w-5/6 md:w-11/12 flex flex-col self-start md:ml-2" to="/">
        <Img className="align-middle" fluid={data.file.childImageSharp.fluid} />
      </Link>
      <span className="my-0 hidden md:flex text-white md:ml-8 text-center italic">{siteDescription}</span>
      <MenuSearch buttonClassName="ml-auto" isNavVisible={isNavVisible} toggleNav={toggleNav} />
      <ul style={{ marginTop: headerHeight }} className={cx(`ccp-nav flex flex-col text-center flex-center items-center`, { 'show-nav': isNavVisible })}>
        <li className="mb-8 mt-4"><span className="my-0 flex text-white text-center italic">{siteDescription}</span></li>
        <li className="py-6 w-full border-white my-0">
          <input
            className="rounded-lg lg:hidden leading-loose p-2 text-black outline-none focus:border-gray-300 border-solid border"
            type="text"
            value={searchString}
            onChange={handleInputChange}
            onKeyUp={handleSearch}
            placeholder={searchPlaceholder} />
            <button tabIndex="0" onClick={submitSearch}>
              <FontAwesomeIcon icon={faSearch} color="white" className="ml-2" size="lg" />
            </button>
        </li>
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
