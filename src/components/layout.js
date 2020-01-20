/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "../styles/index.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const [headerHeight, setHeaderHeight] = useState(0);
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeaderHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <Header ref={measuredRef} headerHeight={headerHeight} siteDescription={data.site.siteMetadata.description} />
      <div style={{ paddingTop: headerHeight }} className="bg-gray-200 flex flex-col h-full">
        <main className="flex-grow">{children}</main>
        <footer className="flex-shrink-0 text-center">
          © {new Date().getFullYear()}, Christ Church Presbyterian, Charleston
          SC
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
