import React from "react"
import { Link } from "gatsby"

const Card = ({ title, children, slug }) => {
  return (
    <Link className="no-underline" to={`/${slug}`}>
      <div className="bg-gray-100 mb-5 hover:bg-white shadow-lg rounded px-5 py-10">
        <h2>{title}</h2>
        {children}
      </div>
    </Link>
  )
}

export default Card
