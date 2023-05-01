import React from 'react';
import logo from './logo.svg';
import {BrowserRouter , Routes, Route} from "react-router-dom"
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import ListProduct from './pages/ListProduct';
// import DetailBlog from './components/DetailBlog';
import Login from './pages/Login';
import ForgotPassword from './pages/FortgotPassword';
import Resgin from './pages/Resgin';
import DetailBlog from './components/DetailBlog';
import AdSwiper from './components/AdSwiper';
import DetailProduct from './pages/DetailProduct';
import Cart from './pages/Cart'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
        <Route index element={<Home/>} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact/>} />
        <Route path="chuyen-farm-ke" element={<Blog/>} />
        <Route path="chuyen-farm-ke/:id" element={<DetailBlog/>} />
        <Route path="san-pham" element={<ListProduct/>} />
        <Route path="dang-nhap" element={<Login/>} />
        <Route path="quen-mat-khau" element={<ForgotPassword/>} />
        <Route path="dang-ky-tai-khoan" element={<Resgin/>} />
        <Route path="adswiper" element={<AdSwiper/>} />
        <Route path="/san-pham/:id" element={<DetailProduct/>} />
        <Route path="/gio-hang" element={<Cart/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
