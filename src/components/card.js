import React from "react"
import { Link } from "gatsby"

const Card = ({ title, children, slug, classNames }) => {
  return (
    <Link className={`w-full md:w-5/6 max-w-4xl mx-4 no-underline ${classNames}`} to={`/${slug}`}>
      <div className="ccp-card__container mb-5 mx-auto w-full bg-white hover:bg-white shadow-lg rounded px-5 py-10">
        {slug.includes('blog') && <h2 dangerouslySetInnerHTML={{ __html: title }}/>}
        {!slug.includes('blog') && <h2 className="text-center">{title}</h2>}
        {children}
      </div>
    </Link>
  )
}

export default Card
