import React, { useState, useEffect } from "react"
import { debounce } from "lodash"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const searchPlaceholder = "Sermons / Blogs"

const SearchInput = ({
    submitSearch,
    placeHolder = searchPlaceholder,
    classNames,
    submitOnType = false,
    initialSearchString = ""
}) => {
  const [searchString, setSearchString] = useState(initialSearchString)

  const handleSubmit = (str = searchString) => {
      submitSearch(str)
  }
    
  const handleSearch = (e) => {
    e.preventDefault()
    if(e.keyCode === 13) {
      handleSubmit()
    }
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
    if (submitOnType) {
      debounce((value) => handleSubmit(value), 250)(e.target.value);
    }
  }
  
  return (
      <React.Fragment>
        <input
        className={`rounded-lg leading-loose p-2 text-black outline-none focus:border-gray-300 border-solid border ${classNames}`}
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
