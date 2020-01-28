/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useCallback, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { throttle } from "lodash"

import Header from "./header"
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
    <div onScroll={onScroll} style={{ overflow: 'auto' }} className="h-full">
      <Header ref={measuredRef} headerHeight={headerHeight} siteDescription={data.site.siteMetadata.description} />
      <div style={{ paddingTop: headerHeight }} className="bg-gray-200 flex flex-col h-full">
        <main className="flex-grow">
          {children.map((child) => React.cloneElement(child, { headerHeight }))}
        </main>
        <footer className="flex-shrink-0 text-center">
          © {new Date().getFullYear()}, Christ Church Presbyterian, Charleston
          SC
        </footer>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
