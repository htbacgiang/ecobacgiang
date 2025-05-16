import React from 'react'
import { FacebookProvider, CustomChat } from 'react-facebook';
const FacebookMsg = () => {
  return (
    <FacebookProvider appId="405438551923161" chatSupport>
        <CustomChat pageId="147995528391633" minimized={true}/>
      </FacebookProvider>  
  )
}

export default FacebookMsg