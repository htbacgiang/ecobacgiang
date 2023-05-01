import React from 'react'
import Carousel from 'better-react-carousel'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Cachua from '../../src/Image/rau/ca-chua.jpg'

const AdSwiper = () => {
  return (
    <Carousel cols={5} rows={1} gap={10} loop={true} scrollSnap={true} >
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard'>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='product position-relative'>
        <Link to='/san-pham/:id' className='addtocard' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
          <div className='product-img'>
            <img src={Cachua} alt='' />
          </div>
          <h5 className='product-title'>Cà chua Hà Lan</h5>
          <p className='price'> 60.000đ </p>
          <div className='action-bar position-absolute'>
            <div className='d-flex flex-column'>
            </div>
          </div>
            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
          </Link>
        </div>
      </Carousel.Item>
    </Carousel>
  )
}
export default AdSwiper
