import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Meta = (props) => {
  return (
    <HelmetProvider>
      <meta charSet="utf-8" />
      <title>{props.title} </title>
      <meta name="description" content={props.desc} />
      <meta name="theme-color" content="#008f68" />

    </HelmetProvider>

  )
}

export default Meta