import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faGift, faHeadphones, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import Catalogue from './Catalogue'
import BlogCard from '../components/blogCard'
import Product from '../components/Product'
import Banner from '../components/Banner'
import IconBox from '../components/iconBox'
import { Link } from 'react-router-dom'
import BreadCrumb from '../components/BreadCrumb'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Meta from '../components/Meta';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper';
import Container from '../../src/components/Container'
import { banner, banner1 } from '../utils/Data'

const Home = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
      <Meta title={'Eco BacGiang - Agriculture of Think '}
        desc={'Chào mừng bạn đến với website của Eco BacGiang'}
      />
      <Container class1='home-wrapper-1' >
        <div className='row'>
          <div className='col-6'>

            <div className='main-banner position-relative '>

              <div className='slide' >
                <Swiper
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                  onAutoplayTimeLeft={onAutoplayTimeLeft}
                  className="mySwiper"
                >
                  {banner?.map((i, j) => {
                    return (
                      <SwiperSlide key={j} ><img src={i.image} /></SwiperSlide>
                    );
                  })}
                  <div className="autoplay-progress" slot="container-end" style={{ display: 'none' }}>
                    <svg viewBox="0 0 0 0" ref={progressCircle}>
                    </svg>
                    <span ref={progressContent}></span>
                  </div>
                </Swiper>
              </div>
            </div>
          </div>

          <div className='col-6'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
              <div className='small-banner position-relative'>
                {banner1?.map((i, j) => {
                  return (
                    <img src={i.image} className='img-fluid banner4' key={j} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </Container>
      <Banner />
      <IconBox />
      <Container class1=''>
        <div className='row'>
          <div className='col-12 link-section'>
            <Link to='/san-pham' className=''> <h3 className='section-heading'> RAU - CỦ - QUẢ</h3></Link>
            <b></b>
            <p className=''>
              Kiến thức sống xanh, sống sạch, sống heathy dành cho bạn, mỗi ngày một khoẻ hơn
            </p>
          </div>
        </div>
        <Product />
      </Container>
      <Container class1='blog-wrapper py-5 home-wrapper'>
        <div className='row'>
          <div className='col-12 link-section'>
            <Link to='/chuyen-farm-ke' className=''> <h3 className='section-heading'> BLOG SỐNG XANH </h3></Link>
            <b></b>
            <p className=''>
              Kiến thức sống xanh, sống sạch, sống heathy dành cho bạn, mỗi ngày một khoẻ hơn
            </p>
          </div>
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </Container>

    </>
  )
}

export default Home