import React, { useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const searchPlaceholder = "Sermons / Blogs"

const SearchInput = ({ submitSearch, placeHolder = searchPlaceholder }) => {
  const [searchString, setSearchString] = useState("")

  const handleSubmit = () => {
      submitSearch(searchString)
  }
    
  const handleSearch = (e) => {
    e.preventDefault()
    console.log("e", e.keyCode)
    if(e.keyCode === 13) {
        console.log("SQRLE GGGG")

      handleSubmit()
    }
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }
  
  return (
      <React.Fragment>
        <input
        className="rounded-lg lg:hidden leading-loose p-2 text-black outline-none focus:border-gray-300 border-solid border"
        type="text"
        value={searchString}
        onChange={handleInputChange}
        onKeyUp={handleSearch}
        placeholder={placeHolder} />
        <button tabIndex="0" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faSearch} color="white" className="ml-2" size="lg" />
        </button>
      </React.Fragment>
  )
}

export default SearchInput
