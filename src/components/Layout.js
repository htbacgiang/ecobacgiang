import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./Header"
import Footer from "./Footer"
import Slide from '../pages/Slide'
import Home from '../pages/Home'
const Layout = () => {
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout