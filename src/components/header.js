import React, { useState } from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import cx from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"

import MenuSearch from "../icons/menuSearch"
import SearchInput from "./searchInput"

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
    site {
      siteMetadata {
        links {
          label
          link
          children {
            label
            link
          }
        }
      }
    }
  }
  `)

  const [isNavVisible, showNav] = useState(false);
  const [isAboutExpanded, toggleExpand] = useState(false);

  const toggleNav = () => showNav(!isNavVisible)
  
  const toggleExpandableSection = () => toggleExpand(!isAboutExpanded);
  
  const getIcon = () => isAboutExpanded ? faChevronUp : faChevronDown;

  const submitSearch = (str, _) => {
    debugger;
    console.log("submit search", str);
    navigate('/search', {
      state: {
        searchString: str
      }})
  }

  return (
    <header ref={ref} className="p-4 fixed w-full left-0 top-0 flex flex-row items-center justify-start">
      <Link className="w-5/6 md:w-1/2 flex flex-col self-start md:ml-2" to="/">
        <Img className="align-middle max-w-xs" fluid={data.file.childImageSharp.fluid} />
      </Link>
      <span className="my-0 hidden md:flex text-white md:ml-8 text-center italic md:ml-auto">{siteDescription}</span>
      <MenuSearch buttonClassName="ml-auto md:ml-4" isNavVisible={isNavVisible} toggleNav={toggleNav} />
      <ul style={{ marginTop: headerHeight, width: '310px' }} className={cx(`ccp-nav flex flex-col text-center flex-center items-center overflow-y-scroll`, { 'show-nav': isNavVisible })}>
        <li className="cursor-pointer mb-8 mt-4"><span className="my-0 flex text-white text-center italic">{siteDescription}</span></li>
        <li className="cursor-pointer py-6 w-full border-white my-0">
          <SearchInput submitSearch={submitSearch} classNames="w-3/4"/>
        </li>
        {data.site.siteMetadata.links.map((link) => (
          <li className="cursor-pointer py-6 w-3/4 border-white my-0">
            {link.children && (
              <React.Fragment>
                <Link className="mr-3" to={link.link}>{link.label}</Link>
                <button className="focus:outline-none" onClick={toggleExpandableSection}><FontAwesomeIcon icon={getIcon()} /></button>
                <ul className={`${cx({ hidden: !isAboutExpanded })} flex flex-col p-0 mx-0`}>
                  {link.children.map((nestedLink) => (
                    <li>
                      <Link to={nestedLink.link}>{nestedLink.label}</Link>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )}
            {!link.children && <Link to={link.link}>{link.label}</Link>}
          </li>
        ))}
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
