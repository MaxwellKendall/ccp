/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useCallback, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"
import { throttle } from "lodash"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram, faMailchimp } from "@fortawesome/free-brands-svg-icons"

import Header from "./header"
import Img from "gatsby-image"
import "../styles/index.scss"

const Layout = ({ onScroll, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
      footerImg: file(relativePath: {eq: "ccp_logo.png"}) {
        childImageSharp {
          fluid(maxWidth: 150, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  const [headerHeight, setHeaderHeight] = useState(0)
  const [ref, setRef] = useState(null)
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setRef(node)
      setHeaderHeight(node.getBoundingClientRect().height)
    }
  }, [])

  useEffect(() => {
   window.addEventListener('resize', throttle(() => measuredRef(ref), 100))
   
   return () => window.removeEventListener('resize', null)
  }, [measuredRef, ref])

  return (
    <div onScroll={onScroll} style={{ overflow: 'auto' }} className="h-full bg-gray-200">
      <Header ref={measuredRef} headerHeight={headerHeight} siteDescription={data.site.siteMetadata.description} />
      <div style={{ paddingTop: headerHeight }} className="flex flex-col h-full">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="flex flex-col items-center justify-center flex-shrink-0 py-4 px-2">
          <div className="flex items-center justify-center w-full pb-8">
            <Link className="mr-auto w-2/4" to="/">
              <Img fluid={data.footerImg.childImageSharp.fluid} />
            </Link>
            <div className="w-1/4">
              <a href="https://www.facebook.com/christchurchcharleston" className="mr-2"><FontAwesomeIcon icon={faFacebook} color="white" size="lg" /></a>
              <a href="https://www.instagram.com/christchurchcharleston/"><FontAwesomeIcon icon={faInstagram} color="white" size="lg" /></a>
              <a href="https://www.facebook.com/christchurchcharleston" className="ml-2"><FontAwesomeIcon icon={faMailchimp} color="white" size="lg" /></a>
            </div>
          </div>
            <p className="text-white text-center w-full">
              © {new Date().getFullYear()}, Christ Church Presbyterian, Charleston
            SC
            </p>
        </footer>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
