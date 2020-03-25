import React from "react"
import { Link } from "gatsby"

const Card = ({ title, children, slug }) => {
  return (
    <Link className="md:w-1/2 mx-auto no-underline" to={`/${slug}`}>
      <div className="mb-5 mx-auto w-full bg-white hover:bg-white shadow-lg rounded px-5 py-10">
        {slug.includes('blog') && <h2 dangerouslySetInnerHTML={{ __html: title }}/>}
        {!slug.includes('blog') && <h2>{title}</h2>}
        {children}
      </div>
    </Link>
  )
}

export default Card
