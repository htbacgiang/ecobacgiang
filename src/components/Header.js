import React from 'react'
import Marquee from "react-fast-marquee";
import { BsSearch } from 'react-icons/bs'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import Logo from '../../src/Image/logo.png'
const Header = () => {
  return (
    <>
      <header className='header-top-strip py-1'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-6 '>
              <Marquee className='card-wrap'>
                <p className='text-white mb-0'>Free ship quanh thành phố Bắc Giang</p>
              </Marquee>
            </div>
            <div className='col-6'> <p className='text-white mb-0'> Hotline : <a className='text-white' href='tel: 0979842701 '> 0979 84 2701</a> | Email: truong@truongnq.vn </p> </div>

          </div>
        </div>
      </header>
      <header className='header-upper'>
        <div className='container-xxl'>
          <div className='row image'>
            <div className='col-3'>
              <Link to='/'> <img src={Logo} alt='logo' /> </Link>
            </div>
            <div className='col-5'>
              <div className="input-group py-2">
                <input type="text"
                  className="form-control"
                  placeholder="Bạn có thể tìm kiếm mọi thứ tại đây"
                  aria-label="Bạn có thể tìm kiếm mọi thứ tại đây"
                  aria-describedby="basic-addon2" />
                <span className="input-group-text p-6"
                  id="basic-addon2"> <BsSearch className='fs-6' /> </span>
              </div>
            </div>
            <div className='col-4'>
              <div className='header-upper-links d-flex'>

                <div className='cart'>
                  <Link className='icon' to='dang-nhap'>
                    <FontAwesomeIcon icon={faUser} />
                    <p> Đăng nhập <br /> Đăng ký </p>
                  </Link>
                </div>

                <div className='cart'>
                  <Link className='icon' to='/gio-hang'>
                    <FontAwesomeIcon icon={faCartPlus} />
                    <p> Giỏ hàng của bạn <br />
                      (0) sản phẩm </p>
                  </Link>

                </div>

              </div>
            </div>
          </div>
        </div>
      </header>
      <header className='header-botton'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-3'>
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle bg-transparent boder-0"
                  type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  DANH MỤC SẢN PHẨM
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><Link className="dropdown-item dropdown-item-top" to="sanpham/rau-cu-qua">Rau - củ - quả - hạt tươi </Link> </li>
                  <li><Link className="dropdown-item" to="#">Rau thuỷ cảnh </Link> </li>
                  <li><Link className="dropdown-item" to="#">Thực phẩm khô </Link> </li>

                </ul>
              </div>
            </div>
            <div className='col-9'>
              <div className='menu-botton d-flex laign-items-center'>
                <div className='menu-links'>
                  <div className='menu-links-child'>
                    <NavLink to='/'> TRANG CHỦ </NavLink>
                    <NavLink to='/about'> VỀ CHÚNG TÔI </NavLink>
                    <NavLink to='/chuyen-farm-ke'>CHUYỆN FARM KỂ </NavLink>
                    <NavLink to='/contact'> ẢNH KỂ CHUYỆN</NavLink>
                    <NavLink to='/contact'> LIÊN HỆ</NavLink>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header