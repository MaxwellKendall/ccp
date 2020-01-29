import { useState } from 'react'

export const useInfiniteScroll = (defaultEndIndex) => {
    const [endIndex, setEndIndex] = useState(defaultEndIndex)
    const handleScroll = e => {
      const { scrollHeight, scrollTop, clientHeight } = e.target
      const pxTilBottom = scrollHeight - scrollTop
      // 100px before they get to the bottom of the screen
      const shouldAddMoreScrollingSpace = pxTilBottom - 100 < clientHeight
      if (shouldAddMoreScrollingSpace) {
        setEndIndex(endIndex + defaultEndIndex)
      }
    }
  
    return [endIndex, setEndIndex, handleScroll]
  }