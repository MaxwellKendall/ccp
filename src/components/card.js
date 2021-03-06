import React from "react"
import { Link } from "gatsby"

import { removeHTMLAndUnicode } from "../helpers/regexHelper"
import { HighlightedText } from "../helpers/searchHelpers"

const Card = ({
  title,
  children,
  slug,
  classNames = '',
  searchString,
  isSearchEnabled = true,
}) => {
  const parsedTitle = slug.includes('blog')
    ? removeHTMLAndUnicode(title)
    : title

  return (
    <Link className={`w-full md:w-5/6 max-w-6xl mx-4 no-underline ${classNames}`} to={`/${slug}`}>
      <div className="ccp-card__container mb-5 mx-auto w-full bg-white hover:bg-white shadow-lg rounded px-10 py-10">
        <h2 className="text-center">
          {isSearchEnabled && (
            <HighlightedText searchString={searchString} text={parsedTitle} />
          )}
          {!isSearchEnabled && parsedTitle}
        </h2>
        {children}
      </div>
    </Link>
  )
}

export default Card
